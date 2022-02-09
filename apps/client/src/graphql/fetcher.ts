import { GraphQLClient } from "graphql-request";
import { RequestInit } from "graphql-request/dist/types.dom";

export const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
  {
    credentials: "include",
  }
);

export const fetch = function fetcher<TData, TVariables>(
  query: string,
  variables?: TVariables,
  headers?: RequestInit["headers"]
) {
  return async (): Promise<TData> => {
    return client.request<TData, TVariables>(query, variables, headers);
  };
};
