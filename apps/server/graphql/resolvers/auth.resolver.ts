import { Resolvers } from "../../types/graphql.generated";
import {
  AuthenticationError,
  ApolloError,
  UserInputError,
  ForbiddenError,
} from "apollo-server-express";
import {
  generatePassword,
  comparePassword,
  resetPasswordToken,
} from "../../utils/auth";
import { sendEmail } from "../../utils/sendEmail";
import { redis } from "../../utils/redis";
import { generateSecret, verifyToken } from "node-2fa";

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
        verified: user.verified,
      };

      const ip = (
        (req.headers["x-forwarded-for"] as string) ||
        (req.socket.remoteAddress as string) ||
        ""
      )
        .split(",")[0]
        .trim();

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
        verified: user.verified,
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
          verified: true,
        },
      });

      req.session.user = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        secret: user.secret,
        validTotp: false,
        verified: user.verified,
      };

      const ip = (
        (req.headers["x-forwarded-for"] as string) ||
        (req.socket.remoteAddress as string) ||
        ""
      )
        .split(",")[0]
        .trim();

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

      sendEmail({
        to: email,
        subject: "Reset password",
        text: `Hi,\n\nYou can reset here: `,
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
    resetPassword: async (
      _,
      { oldPassword, newPassword },
      { isAuth, user, prisma }
    ) => {
      if (!isAuth || !user) {
        throw new AuthenticationError("You must be logged in!");
      }

      const u = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!u) throw new ApolloError("No user found");

      const checkOldPassword = await comparePassword(u.password, oldPassword);

      if (!checkOldPassword) {
        throw new UserInputError("Wrong current password");
      }

      const newPasswordHash = await generatePassword(newPassword);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: newPasswordHash },
      });

      return true;
    },
    resetPasswordWithEmail: async (_, { email }, { prisma }) => {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new UserInputError("E-mail not found", {
          arg: "email",
        });
      }

      const { token, hash } = await resetPasswordToken();

      await prisma.passwordReset.create({
        data: {
          token: hash,
          user: {
            connect: {
              email,
            },
          },
        },
      });

      sendEmail({
        to: email,
        subject: "Reset password",
        text: `Hi,\n\nYou can reset here: ${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user.id}`,
      });

      return null;
    },
    resetPasswordWithToken: async (
      _,
      { userId, token, password },
      { prisma }
    ) => {
      const resetToken = await prisma.passwordReset.findFirst({
        where: {
          AND: [
            {
              userId,
            },
            {
              createdAt: {
                // Token expires in 30 min
                gte: new Date(new Date().getTime() - 30 * 60 * 1000),
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!resetToken) {
        throw new ForbiddenError("Reset token not valid or expired");
      }

      const checkToken = await comparePassword(resetToken.token, token);

      if (!checkToken) {
        throw new ForbiddenError("Reset token not valid or expired");
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: await generatePassword(password),
        },
      });

      await prisma.passwordReset.delete({
        where: {
          id: resetToken.id,
        },
      });

      return null;
    },
  },
};

export default resolver;
