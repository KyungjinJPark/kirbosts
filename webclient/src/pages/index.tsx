import { Button, Flex, Stack } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import { useState } from "react"
import { BostListing } from "../components/BostListing"
import { Layout } from "../components/Layout"
import { useBostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

const Index = () => {
  const [variables, setVariables] = useState({limit: 10, cursor: null as string})
  const [{data, fetching}] = useBostsQuery({variables})

  if (!fetching && !data) {
    return <div>Bosts failed to load</div> 
  }

  return (
    <Layout>
      {fetching && !data
        ? <div>loading...</div>
        : <Stack spacing={8}>
          {data.bosts.bosts.map((bost) => {
            return !bost ? null : <BostListing bost={bost} />
          })}
        </Stack>
      }
      {data && data.bosts.hasMore
        ? <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.bosts.bosts[data.bosts.bosts.length - 1].createdAt
              })
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >Load more</Button>
        </Flex>
        : undefined}
    </Layout>
  )
}

// ssr on bc page has queries & the results are important for SEO
// This causes problems for `NavBar`
export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
