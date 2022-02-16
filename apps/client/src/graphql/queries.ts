import { RequestInit } from 'graphql-request/dist/types.dom';
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';
import { fetch } from '../graphql/fetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteSession?: Maybe<Session>;
  disableTotp?: Maybe<Scalars['Boolean']>;
  enableTotp?: Maybe<Scalars['Boolean']>;
  login?: Maybe<User>;
  logout?: Maybe<Scalars['Boolean']>;
  resetPassword?: Maybe<Scalars['Boolean']>;
  resetPasswordWithEmail?: Maybe<Scalars['Boolean']>;
  root?: Maybe<Scalars['String']>;
  signUp?: Maybe<User>;
  verifyTotp?: Maybe<Scalars['Boolean']>;
};


export type MutationDeleteSessionArgs = {
  id: Scalars['String'];
};


export type MutationEnableTotpArgs = {
  secret: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationResetPasswordWithEmailArgs = {
  email: Scalars['String'];
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationVerifyTotpArgs = {
  code: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getTotp: Totp;
  me?: Maybe<User>;
  root?: Maybe<Scalars['String']>;
  sessions?: Maybe<Array<Session>>;
};

export type Session = {
  __typename?: 'Session';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  ip: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user?: Maybe<User>;
  userId: Scalars['String'];
};

export type Totp = {
  __typename?: 'Totp';
  qr: Scalars['String'];
  secret: Scalars['String'];
  uri: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  enabledTotp?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', deleteSession?: { __typename?: 'Session', id: string } | null };

export type DisableTotpMutationVariables = Exact<{ [key: string]: never; }>;


export type DisableTotpMutation = { __typename?: 'Mutation', disableTotp?: boolean | null };

export type EnableTotpMutationVariables = Exact<{
  secret: Scalars['String'];
}>;


export type EnableTotpMutation = { __typename?: 'Mutation', enableTotp?: boolean | null };

export type GetTotpQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTotpQuery = { __typename?: 'Query', getTotp: { __typename?: 'Totp', secret: string, qr: string, uri: string } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', id: string, enabledTotp?: boolean | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: boolean | null };

export type ResetPasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword?: boolean | null };

export type SessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionsQuery = { __typename?: 'Query', sessions?: Array<{ __typename?: 'Session', id: string, createdAt: any, ip: string }> | null };

export type SignUpMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'User', id: string } | null };

export type VerifyTotpMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type VerifyTotpMutation = { __typename?: 'Mutation', verifyTotp?: boolean | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, enabledTotp?: boolean | null } | null };


export const DeleteSessionDocument = `
    mutation DeleteSession($id: String!) {
  deleteSession(id: $id) {
    id
  }
}
    `;
export const useDeleteSessionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteSessionMutation, TError, DeleteSessionMutationVariables, TContext>) =>
    useMutation<DeleteSessionMutation, TError, DeleteSessionMutationVariables, TContext>(
      ['DeleteSession'],
      (variables?: DeleteSessionMutationVariables) => fetch<DeleteSessionMutation, DeleteSessionMutationVariables>(DeleteSessionDocument, variables)(),
      options
    );
export const DisableTotpDocument = `
    mutation DisableTotp {
  disableTotp
}
    `;
export const useDisableTotpMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DisableTotpMutation, TError, DisableTotpMutationVariables, TContext>) =>
    useMutation<DisableTotpMutation, TError, DisableTotpMutationVariables, TContext>(
      ['DisableTotp'],
      (variables?: DisableTotpMutationVariables) => fetch<DisableTotpMutation, DisableTotpMutationVariables>(DisableTotpDocument, variables)(),
      options
    );
export const EnableTotpDocument = `
    mutation EnableTotp($secret: String!) {
  enableTotp(secret: $secret)
}
    `;
export const useEnableTotpMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<EnableTotpMutation, TError, EnableTotpMutationVariables, TContext>) =>
    useMutation<EnableTotpMutation, TError, EnableTotpMutationVariables, TContext>(
      ['EnableTotp'],
      (variables?: EnableTotpMutationVariables) => fetch<EnableTotpMutation, EnableTotpMutationVariables>(EnableTotpDocument, variables)(),
      options
    );
export const GetTotpDocument = `
    query GetTotp {
  getTotp {
    secret
    qr
    uri
  }
}
    `;
export const useGetTotpQuery = <
      TData = GetTotpQuery,
      TError = unknown
    >(
      variables?: GetTotpQueryVariables,
      options?: UseQueryOptions<GetTotpQuery, TError, TData>
    ) =>
    useQuery<GetTotpQuery, TError, TData>(
      variables === undefined ? ['GetTotp'] : ['GetTotp', variables],
      fetch<GetTotpQuery, GetTotpQueryVariables>(GetTotpDocument, variables),
      options
    );
export const LoginDocument = `
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    enabledTotp
  }
}
    `;
export const useLoginMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext>) =>
    useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
      ['Login'],
      (variables?: LoginMutationVariables) => fetch<LoginMutation, LoginMutationVariables>(LoginDocument, variables)(),
      options
    );
export const LogoutDocument = `
    mutation Logout {
  logout
}
    `;
export const useLogoutMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LogoutMutation, TError, LogoutMutationVariables, TContext>) =>
    useMutation<LogoutMutation, TError, LogoutMutationVariables, TContext>(
      ['Logout'],
      (variables?: LogoutMutationVariables) => fetch<LogoutMutation, LogoutMutationVariables>(LogoutDocument, variables)(),
      options
    );
export const ResetPasswordDocument = `
    mutation ResetPassword($oldPassword: String!, $newPassword: String!) {
  resetPassword(oldPassword: $oldPassword, newPassword: $newPassword)
}
    `;
export const useResetPasswordMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ResetPasswordMutation, TError, ResetPasswordMutationVariables, TContext>) =>
    useMutation<ResetPasswordMutation, TError, ResetPasswordMutationVariables, TContext>(
      ['ResetPassword'],
      (variables?: ResetPasswordMutationVariables) => fetch<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, variables)(),
      options
    );
export const SessionsDocument = `
    query Sessions {
  sessions {
    id
    createdAt
    ip
  }
}
    `;
export const useSessionsQuery = <
      TData = SessionsQuery,
      TError = unknown
    >(
      variables?: SessionsQueryVariables,
      options?: UseQueryOptions<SessionsQuery, TError, TData>
    ) =>
    useQuery<SessionsQuery, TError, TData>(
      variables === undefined ? ['Sessions'] : ['Sessions', variables],
      fetch<SessionsQuery, SessionsQueryVariables>(SessionsDocument, variables),
      options
    );
export const SignUpDocument = `
    mutation SignUp($email: String!, $password: String!) {
  signUp(email: $email, password: $password) {
    id
  }
}
    `;
export const useSignUpMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SignUpMutation, TError, SignUpMutationVariables, TContext>) =>
    useMutation<SignUpMutation, TError, SignUpMutationVariables, TContext>(
      ['SignUp'],
      (variables?: SignUpMutationVariables) => fetch<SignUpMutation, SignUpMutationVariables>(SignUpDocument, variables)(),
      options
    );
export const VerifyTotpDocument = `
    mutation VerifyTotp($code: String!) {
  verifyTotp(code: $code)
}
    `;
export const useVerifyTotpMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<VerifyTotpMutation, TError, VerifyTotpMutationVariables, TContext>) =>
    useMutation<VerifyTotpMutation, TError, VerifyTotpMutationVariables, TContext>(
      ['VerifyTotp'],
      (variables?: VerifyTotpMutationVariables) => fetch<VerifyTotpMutation, VerifyTotpMutationVariables>(VerifyTotpDocument, variables)(),
      options
    );
export const MeDocument = `
    query Me {
  me {
    id
    email
    enabledTotp
  }
}
    `;
export const useMeQuery = <
      TData = MeQuery,
      TError = unknown
    >(
      variables?: MeQueryVariables,
      options?: UseQueryOptions<MeQuery, TError, TData>
    ) =>
    useQuery<MeQuery, TError, TData>(
      variables === undefined ? ['Me'] : ['Me', variables],
      fetch<MeQuery, MeQueryVariables>(MeDocument, variables),
      options
    );