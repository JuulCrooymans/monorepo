import { Resolvers } from "../../types/graphql.generated";
import { AuthenticationError, ApolloError } from "apollo-server-express";
import { generatePassword, comparePassword } from "../../utils/auth";

const resolver: Resolvers = {
  Mutation: {
    login: async (_, { email, password }, { prisma, req, res }) => {
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
      };

      return {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
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
        },
      });

      req.session.user = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
      };

      return user;
    },
    logout: async (_, __, { req, res }) => {
      return new Promise((resolve, rej) =>
        req.session.destroy((err: Error) => {
          if (err) {
            return rej(false);
          }

          res.clearCookie("sess");
          return resolve(true);
        })
      );
    },
  },
};

export default resolver;
