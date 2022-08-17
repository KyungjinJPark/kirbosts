import { Alert, AlertIcon, Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { CommentListing } from "../../components/CommentListing";
import { CommentCreateForm } from "../../components/CommentCreateForm";
import { EditDeleteBostButtons } from "../../components/EditDeleteBostButtons";
import { Layout } from "../../components/Layout";
import { useBostQuery, useCommentsQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toIntId } from "../../utils/toIntId";

const Bost: NextPage = () => {
  const router = useRouter()
  const bostId = toIntId(router.query.id)
  const [{data, error, fetching}] = useBostQuery({
    pause: bostId === -1,
    variables: {
      id: bostId,
    }
  })
  const [{data: commentsData, error: commentsError, fetching: commentsFetching}] = useCommentsQuery({
    variables: {bostId}
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

  let commentsBody = null
  if (commentsFetching) {
    commentsBody = <Text>
      Loading...
    </Text>
  }
  else if (commentsError) {
    commentsBody = <Text>
      {commentsError.message}
    </Text>
  }
  else if (!commentsData?.allCommentsByBostId) {
    commentsBody = <Text>
      Error getting your comments.
    </Text>
  }
  else {
    commentsBody = <Stack spacing={4} mb={8}>
      {commentsData.allCommentsByBostId.map((comment) => {
        return !comment ? null : <CommentListing key={`${comment.bostId},${comment.id}`} comment={comment} />
      })}
    </Stack>
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
      <Box mb={4}><CommentCreateForm bostId={bostId} /></Box>
      {commentsBody}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Bost)