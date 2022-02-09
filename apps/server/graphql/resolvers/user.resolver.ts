import { Resolvers } from "../../types/graphql.generated";
import { AuthenticationError } from "apollo-server-express";

const resolver: Resolvers = {
  Query: {
    me: async (_, __, { prisma, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");

      return await prisma.user.findUnique({
        where: { id: user?.id },
      });
    },
  },
};

export default resolver;
