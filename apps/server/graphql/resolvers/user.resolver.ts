import { Resolvers } from "../../types/graphql.generated";

const resolver: Resolvers = {
  Query: {
    me: async (_, __, { prisma }) => {
      return await prisma.user.findUnique({
        where: { email: "test@test.com" },
      });
    },
  },
};

export default resolver;
