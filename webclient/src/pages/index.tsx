import { Box, Button, Flex, Heading, Link, Stack, Text, IconButton } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import { Layout } from "../components/Layout"
import { useBostsQuery, useDeleteBostMutation, useMeQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import NextLink from "next/link";
import { useState } from "react"
import { AddKirbSection } from "../components/AddKirbSection"
import { DeleteIcon } from "@chakra-ui/icons"

const Index = () => {
  const [{data: medata}] = useMeQuery()
  const [variables, setVariables] = useState({limit: 10, cursor: null as string});
  const [{data, fetching}] = useBostsQuery({variables})
  const [, deleteBost] = useDeleteBostMutation()

  if (!fetching && !data) {
    return <div>Bosts failed to load</div> 
  }

  return (
    <Layout>
      {fetching && !data
        ? <div>loading...</div>
        : <Stack spacing={8}>
          {data.bosts.bosts.map((bost) => {
            return !bost ? null : <Flex key={bost.id} p={5} shadow="md" borderWidth="1px">
              <AddKirbSection bost={bost} />
              <Box flex={1}>
                <NextLink href="/bost/[id]" as={`/bost/${bost.id}`}><Link>
                  <Heading fontSize="xl">{bost.title}</Heading>
                </Link></NextLink>
                <Text>posted by {bost.creator.username}</Text>
                <Text mt={4}>{
                  bost.textSnippet
                }</Text>
              </Box>
              {bost.creator.id === medata.me.id && <IconButton
                onClick={() => deleteBost({
                  id: bost.id,
                })}
                colorScheme="gray"
                aria-label="delete bost"
                icon={<DeleteIcon />}
                size="sm"
              />}
            </Flex>
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
