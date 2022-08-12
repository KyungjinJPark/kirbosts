import { Alert, AlertIcon, Flex, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { EditDeleteBostButtons } from "../../components/EditDeleteBostButtons";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetBostFromUrl } from "../../utils/useGetBostFromUrl";

const Bost: NextPage = () => {
  const [{data, error, fetching}] = useGetBostFromUrl()

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

  const alert = <Alert status='error' mb={4}>
    <AlertIcon />
    A human moderator has thoroughly and holistically evaluated this content
    and has manually marked this bost as possibly offensive.
  </Alert>
  
  return (
    <Layout>
      {data.bost.creator.username === 'republicyuki' && alert}
      <Flex>
        <Heading mr="auto">{data.bost.title}</Heading>
        <EditDeleteBostButtons bostId={data.bost.id} creatorId={data.bost.creator.id} />
      </Flex>
      <Text mb={4}>{data.bost.creator.username}</Text>
      <Text mb={4}>{data.bost.text}</Text>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Bost)