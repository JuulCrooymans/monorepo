import { Resolvers } from "../../types/graphql.generated";
import { AuthenticationError, ApolloError } from "apollo-server-express";
import { generatePassword, comparePassword } from "../../utils/auth";
import { redis } from "../../utils/redis";
import { generateSecret, verifyToken, generateToken } from "node-2fa";

const resolver: Resolvers = {
  Query: {
    sessions: async (_, __, { prisma, user, isAuth }) => {
      if (!isAuth || !user)
        throw new AuthenticationError("You must be logged in!");

      return await prisma.session.findMany({
        where: { userId: user.id },
      });
    },
    getTotp: async (_, __, { user, isAuth }) => {
      if (!isAuth || !user)
        throw new AuthenticationError("You must be logged in!");

      return generateSecret({ name: "Monorepo", account: user.id });
    },
  },
  Mutation: {
    login: async (_, { email, password }, { prisma, req }) => {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) throw new AuthenticationError("Wrong credentials");

      const comparedPassword = await comparePassword(user.password, password);

      if (!comparedPassword) throw new AuthenticationError("Wrong credentials");

      req.session.user = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        secret: user.secret,
        validTotp: false,
      };

      const ip: string =
        (req.headers["x-forwarded-for"] as string) ||
        (req.socket.remoteAddress as string);

      // Store this session in
      await prisma.session.upsert({
        where: { id: req.sessionID },
        create: {
          id: req.sessionID,
          ip,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
        update: {},
      });

      return {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        enabledTotp: !!user.secret,
      };
    },
    signUp: async (_, { email, password }, { prisma, req }) => {
      const checkedEmail = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      if (checkedEmail) throw new ApolloError("Email adress already in use");

      const hashedPassword = await generatePassword(password);

      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
        },
        select: {
          email: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          secret: true,
        },
      });

      req.session.user = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        secret: user.secret,
        validTotp: false,
      };

      const ip: string =
        (req.headers["x-forwarded-for"] as string) ||
        (req.socket.remoteAddress as string);

      // Store this session in
      await prisma.session.create({
        data: {
          id: req.sessionID,
          ip,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return user;
    },
    logout: async (_, __, { prisma, req, res, user, isAuth }) => {
      if (!isAuth) throw new AuthenticationError("You must be logged in!");
      return new Promise((resolve, rej) =>
        req.session.destroy(async (err: Error) => {
          if (err) {
            return rej(false);
          }

          await prisma.session.delete({ where: { id: req.sessionID } });

          res.clearCookie("sess");
          return resolve(true);
        })
      );
    },
    deleteSession: async (_, { id }, { prisma, user, isAuth }) => {
      if (!isAuth) throw new AuthenticationError("You must be logged in!");

      await redis.del(`sess:${id}`);

      return await prisma.session.delete({
        where: {
          id,
        },
      });
    },
    enableTotp: async (_, { secret }, { user, prisma, isAuth, cache }) => {
      if (!isAuth || !user)
        throw new AuthenticationError("You must be logged in!");

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          secret,
        },
      });

      await cache.delete(`me:${user.id}`);

      return true;
    },
    disableTotp: async (_, __, { user, prisma, isAuth, cache }) => {
      if (!isAuth || !user)
        throw new AuthenticationError("You must be logged in!");

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          secret: null,
        },
      });

      await cache.delete(`me:${user.id}`);

      return true;
    },
    verifyTotp: async (_, { code }, { prisma, user, req }) => {
      if (!user) throw new AuthenticationError("No user found in session");
      if (!user.secret) throw new AuthenticationError("Totp not enabled");

      const res = verifyToken(user.secret, code);

      if (res && res.delta === 0) {
        // @ts-ignore user.secret could be null
        req.session.user = {
          ...req.session.user,
          validTotp: true,
        };

        return true;
      }

      return false;
    },
  },
};

export default resolver;
