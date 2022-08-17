import { dedupExchange, fetchExchange, gql } from 'urql'
import { Cache, cacheExchange, Entity, Resolver } from '@urql/exchange-graphcache'
import { LoginMutation, RegisterMutation, MeDocument, MeQuery, LogoutMutation, ChangePasswordMutation, CreateBostMutation, VoteMutation, VoteMutationVariables, DeleteBostMutation, DeleteBostMutationVariables } from '../generated/graphql'
import { isServer } from './isServer'

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

export const createUrqlClient = (ssrExchange, ctx) => {
  let cookie
  if (isServer()) {
    cookie = ctx.req.headers.cookie;
  }
  return ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie
        ? {cookie}
        : undefined
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedBosts: () => null,
          TextSnippetResponse: () => null,
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
                  invalidateAllBosts(cache)
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
              invalidateAllBosts(cache)
            },
            deleteBost: (result: DeleteBostMutation, args: DeleteBostMutationVariables, cache, info) => {
              cache.invalidate({__typename: 'Bost', id: args.id})
            },
            vote: (result: VoteMutation, args: VoteMutationVariables, cache, info) => {
              const {bostId, value} = args
              const data = cache.readFragment(
                gql`
                  fragment _ on Bost {
                    id
                    kirbCount
                    kirbStatus
                  }
                `,
                {id: bostId}
              )
              if (data) {
                // this repeated logic is SUS but necessary 4 cache
                console.log(data.kirbStatus, value)
                let newCount
                let newStatus
                if (data.kirbStatus === 0) {
                  newCount = data.kirbCount + value
                  newStatus = value
                }
                else if (data.kirbStatus === value) {
                  newCount = data.kirbCount - value
                  newStatus = 0
                } else {
                  newCount = data.kirbCount + 2 * value
                  newStatus = value
                }
                cache.writeFragment(
                  gql`
                    fragment _ on Bost {
                      kirbCount
                      kirbStatus
                    }
                  `,
                  {id: bostId, kirbCount: newCount, kirbStatus: newStatus}
                )
              }
            },
          },
        },
      }),
      ssrExchange,
      errorExchange,
      fetchExchange,
    ]
  })
}

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
  }
}

function invalidateAllBosts(cache: Cache) {
  const allFields = cache.inspectFields('Query')
  const fieldInfos = allFields.filter(info => info.fieldName === 'bosts')
  fieldInfos.forEach(({ fieldKey }) => {
    cache.invalidate('Query', fieldKey)
  })
}
