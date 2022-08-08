import { dedupExchange, fetchExchange, stringifyVariables } from 'urql'
import { cacheExchange, Entity, Resolver } from '@urql/exchange-graphcache'
import { LoginMutation, RegisterMutation, MeDocument, MeQuery, LogoutMutation, ChangePasswordMutation, CreateBostMutation, BostsDocument, BostsQuery } from '../generated/graphql'

// BEGIN global error handling
import { pipe, tap } from 'wonka'
import { Exchange } from 'urql'
import Router from 'next/router'

const errorExchange: Exchange = ({forward}) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({error}) => {
      if (error) {
        if (error.message.includes('not logged in')) {
          Router.replace("/login") // replace: more for redirects
        }
      }
    })
  )
}
// END global error handling

export const createUrqlClient = (ssrExchange) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedBosts: () => null,
      },
      resolvers: {
        Query: {
          bosts: cursorPagination(),
        },
      },
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
          createBost: (result: CreateBostMutation, args, cache, info) => {
            const allFields = cache.inspectFields('Query')
            const fieldInfos = allFields.filter(info => info.fieldName === 'bosts')
            fieldInfos.forEach(({fieldKey}) => {
              cache.invalidate('Query', fieldKey)
            })
          },
        },
      },
    }),
    ssrExchange,
    errorExchange,
    fetchExchange,
  ]
})

const cursorPagination = (): Resolver => {

  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info
    const allFields = cache.inspectFields(entityKey)
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName)
    const size = fieldInfos.length
    if (size === 0) {
      return undefined
    }

    // call new query if data is not in cache
    const cacheEntity = cache.resolve({ __typename: entityKey}, fieldName, fieldArgs) as Entity
    const dataCached = cache.resolve(cacheEntity, 'bosts')
    info.partial = !dataCached

    // return all relevant data is in the cache
    const results = []
    let hasMore = true
    fieldInfos.forEach(({fieldKey}) => {
      const dataEntity = cache.resolve({ __typename: entityKey}, fieldKey) as Entity
      const data = cache.resolve(dataEntity, 'bosts') as string[]
      // double !! to convert to bool
      const dataHasMore = !!cache.resolve(dataEntity, 'hasMore')
      results.push(...data)
      hasMore = hasMore && dataHasMore 
    })

    return {
      __typename: 'PaginatedBosts', // TGQL type
      bosts: results,
      hasMore
    }

  //   const visited = new Set();
  //   let result: NullArray<string> = [];
  //   let prevOffset: number | null = null;

  //   for (let i = 0; i < size; i++) {
  //     const { fieldKey, arguments: args } = fieldInfos[i];
  //     if (args === null || !compareArgs(fieldArgs, args)) {
  //       continue;
  //     }

  //     const links = cache.resolve(entityKey, fieldKey) as string[];
  //     const currentOffset = args[cursorArgument];

  //     if (
  //       links === null ||
  //       links.length === 0 ||
  //       typeof currentOffset !== 'number'
  //     ) {
  //       continue;
  //     }

  //     const tempResult: NullArray<string> = [];

  //     for (let j = 0; j < links.length; j++) {
  //       const link = links[j];
  //       if (visited.has(link)) continue;
  //       tempResult.push(link);
  //       visited.add(link);
  //     }

  //     if (
  //       (!prevOffset || currentOffset > prevOffset) ===
  //       (mergeMode === 'after')
  //     ) {
  //       result = [...result, ...tempResult];
  //     } else {
  //       result = [...tempResult, ...result];
  //     }

  //     prevOffset = currentOffset;
  //   }

  //   const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
  //   if (hasCurrentPage) {
  //     return result;
  //   } else if (!(info as any).store.schema) {
  //     return undefined;
  //   } else {
  //     info.partial = true;
  //     return result;
  //   }
  }
}