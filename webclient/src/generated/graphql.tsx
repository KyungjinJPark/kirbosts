import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Bost = {
  __typename?: 'Bost';
  createdAt: Scalars['DateTime'];
  creator: User;
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  kirbCount: Scalars['Int'];
  kirbStatus: Scalars['Int'];
  text: Scalars['String'];
  textSnippet: TextSnippetResponse;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type BostInput = {
  text: Scalars['String'];
  title: Scalars['String'];
};

export type BostResponse = {
  __typename?: 'BostResponse';
  bost?: Maybe<Bost>;
  errors?: Maybe<Array<FieldError>>;
};

export type Comment = {
  __typename?: 'Comment';
  bost: Bost;
  bostId: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  creator: User;
  creatorId: Scalars['Int'];
  edited: Scalars['Boolean'];
  id: Scalars['Int'];
  text: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type CommentResponse = {
  __typename?: 'CommentResponse';
  comment?: Maybe<Comment>;
  errors?: Maybe<Array<FieldError>>;
};

export type CreateCommentInput = {
  bostId: Scalars['Float'];
  text: Scalars['String'];
};

export type DeleteCommentInput = {
  bostId: Scalars['Float'];
  commentId: Scalars['Float'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  createBost: BostResponse;
  createComment: CommentResponse;
  deleteBost: Scalars['Boolean'];
  deleteComment: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updateBost: BostResponse;
  updateComment: CommentResponse;
  vote: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  retypedPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateBostArgs = {
  input: BostInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationDeleteBostArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteCommentArgs = {
  input: DeleteCommentInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationUpdateBostArgs = {
  id: Scalars['Int'];
  text: Scalars['String'];
  title: Scalars['String'];
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationVoteArgs = {
  bostId: Scalars['Int'];
  value: Scalars['Int'];
};

export type PaginatedBosts = {
  __typename?: 'PaginatedBosts';
  bosts: Array<Bost>;
  hasMore: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  allCommentsByBostId: Array<Comment>;
  bost?: Maybe<Bost>;
  bosts: PaginatedBosts;
  hello: Scalars['String'];
  me?: Maybe<User>;
};


export type QueryAllCommentsByBostIdArgs = {
  bostId: Scalars['Int'];
};


export type QueryBostArgs = {
  id: Scalars['Int'];
};


export type QueryBostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type TextSnippetResponse = {
  __typename?: 'TextSnippetResponse';
  hasMore: Scalars['Boolean'];
  snippet: Scalars['String'];
};

export type UpdateCommentInput = {
  bostId: Scalars['Float'];
  commentId: Scalars['Float'];
  text: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type CommonBostFragment = { __typename?: 'Bost', id: number, title: string, kirbCount: number, kirbStatus: number, createdAt: any, updatedAt: any, creator: { __typename?: 'User', id: number, username: string } };

export type CommonFieldErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type CommonUserFragment = { __typename?: 'User', id: number, username: string };

export type CommonUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
  retypedPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type CreateBostMutationVariables = Exact<{
  input: BostInput;
}>;


export type CreateBostMutation = { __typename?: 'Mutation', createBost: { __typename?: 'BostResponse', bost?: { __typename?: 'Bost', id: number, title: string, text: string, creatorId: number, createdAt: any, updatedAt: any, textSnippet: { __typename?: 'TextSnippetResponse', snippet: string, hasMore: boolean } } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type CreateCommentMutationVariables = Exact<{
  input: CreateCommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'CommentResponse', comment?: { __typename?: 'Comment', id: number, bostId: number, text: string, edited: boolean, creatorId: number, createdAt: any, updatedAt: any } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type DeleteBostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteBostMutation = { __typename?: 'Mutation', deleteBost: boolean };

export type DeleteCommentMutationVariables = Exact<{
  input: DeleteCommentInput;
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type UpdateBostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type UpdateBostMutation = { __typename?: 'Mutation', updateBost: { __typename?: 'BostResponse', bost?: { __typename?: 'Bost', id: number, title: string, text: string, updatedAt: any, textSnippet: { __typename?: 'TextSnippetResponse', snippet: string, hasMore: boolean } } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type UpdateCommentMutationVariables = Exact<{
  input: UpdateCommentInput;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'CommentResponse', comment?: { __typename?: 'Comment', id: number, bostId: number, text: string, edited: boolean, updatedAt: any } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  bostId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type BostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type BostQuery = { __typename?: 'Query', bost?: { __typename?: 'Bost', text: string, id: number, title: string, kirbCount: number, kirbStatus: number, createdAt: any, updatedAt: any, creator: { __typename?: 'User', id: number, username: string } } | null };

export type BostTextQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type BostTextQuery = { __typename?: 'Query', bost?: { __typename?: 'Bost', id: number, text: string } | null };

export type BostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type BostsQuery = { __typename?: 'Query', bosts: { __typename?: 'PaginatedBosts', hasMore: boolean, bosts: Array<{ __typename?: 'Bost', id: number, title: string, kirbCount: number, kirbStatus: number, createdAt: any, updatedAt: any, textSnippet: { __typename?: 'TextSnippetResponse', snippet: string, hasMore: boolean }, creator: { __typename?: 'User', id: number, username: string } }> } };

export type CommentsQueryVariables = Exact<{
  bostId: Scalars['Int'];
}>;


export type CommentsQuery = { __typename?: 'Query', allCommentsByBostId: Array<{ __typename?: 'Comment', id: number, bostId: number, text: string, edited: boolean, createdAt: any, updatedAt: any, creator: { __typename?: 'User', id: number, username: string } }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string } | null };

export const CommonBostFragmentDoc = gql`
    fragment CommonBost on Bost {
  id
  title
  kirbCount
  kirbStatus
  createdAt
  updatedAt
  creator {
    id
    username
  }
}
    `;
export const CommonFieldErrorFragmentDoc = gql`
    fragment CommonFieldError on FieldError {
  field
  message
}
    `;
export const CommonUserFragmentDoc = gql`
    fragment CommonUser on User {
  id
  username
}
    `;
export const CommonUserResponseFragmentDoc = gql`
    fragment CommonUserResponse on UserResponse {
  errors {
    ...CommonFieldError
  }
  user {
    ...CommonUser
  }
}
    ${CommonFieldErrorFragmentDoc}
${CommonUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!, $retypedPassword: String!) {
  changePassword(
    token: $token
    newPassword: $newPassword
    retypedPassword: $retypedPassword
  ) {
    ...CommonUserResponse
  }
}
    ${CommonUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateBostDocument = gql`
    mutation CreateBost($input: BostInput!) {
  createBost(input: $input) {
    bost {
      id
      title
      text
      textSnippet {
        snippet
        hasMore
      }
      creatorId
      createdAt
      updatedAt
    }
    errors {
      ...CommonFieldError
    }
  }
}
    ${CommonFieldErrorFragmentDoc}`;

export function useCreateBostMutation() {
  return Urql.useMutation<CreateBostMutation, CreateBostMutationVariables>(CreateBostDocument);
};
export const CreateCommentDocument = gql`
    mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    comment {
      id
      bostId
      text
      edited
      creatorId
      createdAt
      updatedAt
    }
    errors {
      ...CommonFieldError
    }
  }
}
    ${CommonFieldErrorFragmentDoc}`;

export function useCreateCommentMutation() {
  return Urql.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument);
};
export const DeleteBostDocument = gql`
    mutation DeleteBost($id: Int!) {
  deleteBost(id: $id)
}
    `;

export function useDeleteBostMutation() {
  return Urql.useMutation<DeleteBostMutation, DeleteBostMutationVariables>(DeleteBostDocument);
};
export const DeleteCommentDocument = gql`
    mutation DeleteComment($input: DeleteCommentInput!) {
  deleteComment(input: $input)
}
    `;

export function useDeleteCommentMutation() {
  return Urql.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($emailOrUsername: String!, $password: String!) {
  login(emailOrUsername: $emailOrUsername, password: $password) {
    ...CommonUserResponse
  }
}
    ${CommonUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: RegisterInput!) {
  register(options: $options) {
    ...CommonUserResponse
  }
}
    ${CommonUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateBostDocument = gql`
    mutation UpdateBost($id: Int!, $title: String!, $text: String!) {
  updateBost(id: $id, title: $title, text: $text) {
    bost {
      id
      title
      text
      textSnippet {
        snippet
        hasMore
      }
      updatedAt
    }
    errors {
      ...CommonFieldError
    }
  }
}
    ${CommonFieldErrorFragmentDoc}`;

export function useUpdateBostMutation() {
  return Urql.useMutation<UpdateBostMutation, UpdateBostMutationVariables>(UpdateBostDocument);
};
export const UpdateCommentDocument = gql`
    mutation UpdateComment($input: UpdateCommentInput!) {
  updateComment(input: $input) {
    comment {
      id
      bostId
      text
      edited
      updatedAt
    }
    errors {
      ...CommonFieldError
    }
  }
}
    ${CommonFieldErrorFragmentDoc}`;

export function useUpdateCommentMutation() {
  return Urql.useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UpdateCommentDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Int!, $bostId: Int!) {
  vote(value: $value, bostId: $bostId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const BostDocument = gql`
    query Bost($id: Int!) {
  bost(id: $id) {
    ...CommonBost
    text
  }
}
    ${CommonBostFragmentDoc}`;

export function useBostQuery(options: Omit<Urql.UseQueryArgs<BostQueryVariables>, 'query'>) {
  return Urql.useQuery<BostQuery>({ query: BostDocument, ...options });
};
export const BostTextDocument = gql`
    query BostText($id: Int!) {
  bost(id: $id) {
    id
    text
  }
}
    `;

export function useBostTextQuery(options: Omit<Urql.UseQueryArgs<BostTextQueryVariables>, 'query'>) {
  return Urql.useQuery<BostTextQuery>({ query: BostTextDocument, ...options });
};
export const BostsDocument = gql`
    query Bosts($limit: Int!, $cursor: String) {
  bosts(limit: $limit, cursor: $cursor) {
    bosts {
      ...CommonBost
      textSnippet {
        snippet
        hasMore
      }
    }
    hasMore
  }
}
    ${CommonBostFragmentDoc}`;

export function useBostsQuery(options: Omit<Urql.UseQueryArgs<BostsQueryVariables>, 'query'>) {
  return Urql.useQuery<BostsQuery>({ query: BostsDocument, ...options });
};
export const CommentsDocument = gql`
    query Comments($bostId: Int!) {
  allCommentsByBostId(bostId: $bostId) {
    id
    bostId
    text
    edited
    creator {
      id
      username
    }
    createdAt
    updatedAt
  }
}
    `;

export function useCommentsQuery(options: Omit<Urql.UseQueryArgs<CommentsQueryVariables>, 'query'>) {
  return Urql.useQuery<CommentsQuery>({ query: CommentsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...CommonUser
  }
}
    ${CommonUserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};