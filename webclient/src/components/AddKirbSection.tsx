import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Flex, IconButton, Text } from "@chakra-ui/react"
import { BostsQuery, useVoteMutation } from "../generated/graphql"

interface AddKirbSectionProps {
  bost: BostsQuery['bosts']['bosts'][0]
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
        colorScheme={bost.kirbStatus === 1 ? "green" : "gray"}
        aria-label="upkirb bost"
        icon={<ChevronUpIcon />}
        size="sm"
      />
      <Text>{bost.kirbCount}</Text>
      <IconButton
        onClick={() => vote({
          bostId: bost.id,
          value: -1,
        })}
        colorScheme={bost.kirbStatus === -1 ? "red" : "gray"}
        aria-label="downkirb bost"
        icon={<ChevronDownIcon />}
        size="sm"
      />
    </Flex>
  )
}