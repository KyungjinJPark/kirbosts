import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeleteBostMutation, useMeQuery } from "../generated/graphql";

interface EditDeleteBostButtonsProps {
  bostId: number
  creatorId: number
}

export const EditDeleteBostButtons: React.FC<EditDeleteBostButtonsProps> = ({bostId, creatorId}) => {
  const [{data}] = useMeQuery()
  const [, deleteBost] = useDeleteBostMutation()
  
  return creatorId !== data?.me.id ? null : <Box>
    <NextLink href="/bost/edit/[id]" as={`/bost/edit/${bostId}`}>
      <IconButton
        as={Link}
        colorScheme="gray"
        aria-label="edit bost"
        icon={<EditIcon />}
        size="sm"
        mr={2}
      />
    </NextLink>
    <IconButton
      onClick={() => deleteBost({
        id: bostId,
      })}
      colorScheme="gray"
      aria-label="delete bost"
      icon={<DeleteIcon />}
      size="sm"
    />
  </Box>
}