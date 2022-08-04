import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import { Layout } from "../components/Layout"
import { useBostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import NextLink from "next/link";

const Index = () => {
  const [{data}] = useBostsQuery({variables: {limit: 2}})

  return (
    <Layout>
      <Flex align="center">
        <Heading>Kirbosts</Heading>
        <NextLink href="/create-bost"><Link ml="auto">Create a Bost</Link></NextLink>
      </Flex>
      <br />
      {!data
        ? <div>loading...</div>
        : <Stack spacing={8}>
          {data.bosts.map((bost) => {
            return <Box key={bost.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{bost.title}</Heading>
              <Text mt={4}>{
                bost.textSnippet
              }</Text>
            </Box>
          })}
        </Stack>
      }
    </Layout>
  )
}

// ssr on bc page has queries & the results are important for SEO
// This causes problems for `NavBar`
export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
