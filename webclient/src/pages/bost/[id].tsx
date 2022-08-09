import { Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { useBostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Bost: NextPage = () => {
  const router = useRouter()
  const bostId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const [{data, error, fetching}] = useBostQuery({
    pause: bostId === -1,
    variables: {
      id: bostId,
    }
  })

  if (fetching) {
    return <Layout>
      Loading...
    </Layout>
  }

  if (error) {
    return <Layout>
      {error.message}
    </Layout>
  }

  if (!data.bost) {
    return <Layout>
      Error getting your data.
    </Layout>
  }
  
  return (
    <Layout>
      <Heading >{data.bost.title}</Heading>
      <Text mb={4}>{data.bost.creator.username}</Text>
      <br />
      {data.bost.text}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Bost)