import { Resolvers } from "../../types/graphql.generated";
import { AuthenticationError } from "apollo-server-express";

const resolver: Resolvers = {
  Query: {
    me: async (_, __, { prisma, user, isAuth, cache }) => {
      if (!isAuth || !user)
        throw new AuthenticationError("You must be logged in!");

      return await cache.get({
        key: `me:${user.id}`,
        request: async () => {
          const me = await prisma.user.findUnique({
            where: { id: user?.id },
          });

          if (me) {
            return {
              id: me.id,
              updatedAt: me.updatedAt,
              createdAt: me.createdAt,
              email: me.email,
              enabledTotp: !!me.secret,
            };
          }

          return null;
        },
      });
    },
  },
};

export default resolver;
