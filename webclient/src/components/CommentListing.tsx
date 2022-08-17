import { Box, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import { CommentsQuery } from "../generated/graphql"
import { CommentCreateForm } from "./CommentCreateForm"
import { EditDeleteCommentButtons } from "./EditDeleteCommentButtons"

interface CommentListingProps {
  comment: CommentsQuery['allCommentsByBostId'][0]
}

export const CommentListing: React.FC<CommentListingProps> = ({comment}) => {
  const [editing, setEditing] = useState(false)
  return <Flex key={`${comment.bostId},${comment.id}`} p={5} shadow="md" borderWidth="1px">
    <Box flex={1} maxW="100%" >
      <Flex justifyContent="space-between">
        {/* This maxW is sus & might break */}
        <Text flex={1}>posted by {comment.creator.username}{comment.edited ? " (edited)" : ""}</Text>
        <Box minW="4.75rem" ml={2}>
          <EditDeleteCommentButtons
            bostId={comment.bostId}
            commentId={comment.id}
            creatorId={comment.creator.id}
            editing={editing}
            setEditing={setEditing}
          />
        </Box>
      </Flex>
      <Box mt={4}>
        {!editing
          ? <Text>
            {comment.text}
          </Text>
          : <CommentCreateForm
            bostId={comment.bostId}
            editing
            editingComment={comment}
            cancelEdit={() => setEditing(false)}
          />}
      </Box>
    </Box>
  </Flex>
}