import { merge } from "lodash";
import { GraphQLDateTime } from "graphql-scalars";
import userResolver from "./user.resolver";
import { Resolvers } from "../../types/graphql.generated";

const rootResolver: Resolvers = {
  DateTime: GraphQLDateTime,
};

export default merge(rootResolver, userResolver);
