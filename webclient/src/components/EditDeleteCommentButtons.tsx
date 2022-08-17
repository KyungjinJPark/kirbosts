import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import { useDeleteCommentMutation, useMeQuery } from "../generated/graphql";

interface EditDeleteCommentButtonsProps {
  bostId: number
  commentId: number
  creatorId: number
  editing: boolean
  setEditing: (boolean) => void
}

export const EditDeleteCommentButtons: React.FC<EditDeleteCommentButtonsProps> = ({
  bostId,
  commentId,
  creatorId,
  editing,
  setEditing,
}) => {
  const [{data}] = useMeQuery()
  const [, deleteComment] = useDeleteCommentMutation()
  
  return creatorId !== data?.me?.id ? null : <Box>
    <IconButton
      onClick={() => setEditing((e) => !e)}
      colorScheme={!editing ? "gray" : "blue"}
      aria-label="edit bost"
      icon={<EditIcon />}
      size="sm"
      mr={2}
    />
    <IconButton
      onClick={() => deleteComment({input: {bostId, commentId}})}
      colorScheme="gray"
      aria-label="delete bost"
      icon={<DeleteIcon />}
      size="sm"
    />
  </Box>
}