import { dedupExchange, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { LoginMutation, RegisterMutation, MeDocument, MeQuery, LogoutMutation, ChangePasswordMutation } from '../generated/graphql'

export const createUrqlClient = (ssrExchange) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      // update `MeQuery` cache when `login` and `register` is successful
      updates: {
        Mutation: {
          login: (result: LoginMutation, args, cache, info) => { // `login` matches the name of the query
            cache.updateQuery({query: MeDocument /* called that by gql-ag */}, (data: MeQuery): MeQuery  => {
              if (result.login.errors) {
                return data
              } else {
                return {
                  me: result.login.user
                }
              }
            })
          },
          register: (result: RegisterMutation, args, cache, info) => {
            cache.updateQuery({query: MeDocument}, (data: MeQuery): MeQuery  => {
              if (result.register.errors) {
                return data
              } else {
                return {
                  me: result.register.user
                }
              }
            })
          },
          logout: (result: LogoutMutation, args, cache, info) => {
            cache.updateQuery({query: MeDocument}, (data: MeQuery): MeQuery  => {
              return {me: null}
            })
          },
          changePassword: (result: ChangePasswordMutation, args, cache, info) => {
            cache.updateQuery({query: MeDocument}, (data: MeQuery): MeQuery  => { // TODO: very WET code
              if (result.changePassword.errors) {
                return data
              } else {
                return {
                  me: result.changePassword.user
                }
              }
            })
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange]
})