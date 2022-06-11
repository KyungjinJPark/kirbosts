import { ChakraProvider } from '@chakra-ui/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { LoginMutation, RegisterMutation, MeDocument, MeQuery } from '../generated/graphql'

const client = createClient({
  url: 'http://localhost:4000/graphql',
  exchanges: [dedupExchange, cacheExchange({
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
      },
    },
  }), fetchExchange],
  fetchOptions: {
    credentials: 'include'
  }
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
