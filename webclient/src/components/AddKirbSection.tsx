import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Flex, IconButton, Text } from "@chakra-ui/react"
import { BostSnippetFragment, useVoteMutation } from "../generated/graphql"

interface AddKirbSectionProps {
  bost: BostSnippetFragment
}

export const AddKirbSection: React.FC<AddKirbSectionProps> = ({bost}) => {
  const [, vote] = useVoteMutation()
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      mr={4}
    >
      <IconButton
        onClick={() => vote({
          bostId: bost.id,
          value: 1,
        })}
        aria-label="upkirb bost"
        icon={<ChevronUpIcon />}
        size="sm"
        variant="ghost"
      />
      <Text>{bost.kirbCount}</Text>
      <IconButton
        onClick={() => vote({
          bostId: bost.id,
          value: -1,
        })}
        aria-label="downkirb bost"
        icon={<ChevronDownIcon />}
        size="sm"
        variant="ghost"
      />
    </Flex>
  )
}