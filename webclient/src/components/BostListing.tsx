import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { Flex, Box, Heading, Link, Text, Spinner, IconButton } from "@chakra-ui/react"
import NextLink from "next/link"
import { useState } from "react"
import { BostsQuery, useBostTextQuery } from "../generated/graphql"
import { AddKirbSection } from "./AddKirbSection"
import { EditDeleteBostButtons } from "./EditDeleteBostButtons"

interface BostListingProps {
  bost: BostsQuery['bosts']['bosts'][0]
}

export const BostListing: React.FC<BostListingProps> = ({bost}) => {
  const [expanded, setExpanded] = useState(false)
  const [{data, fetching}] = useBostTextQuery({
    pause: !expanded,
    variables: {
      id: bost.id
    },
  })

  let body 
  if (expanded && !fetching) {
    body = data.bost.text
  } else {
    body = bost.textSnippet
  }
  
  return <Flex key={bost.id} p={5} shadow="md" borderWidth="1px">
    <AddKirbSection bost={bost} />
    <Box flex={1} w="91%"> {/* This is sus & might break */}
      <NextLink href="/bost/[id]" as={`/bost/${bost.id}`}>
        <Link>
          <Heading fontSize="xl">{bost.title}</Heading>
        </Link>
      </NextLink>
      <Text>posted by {bost.creator.username}</Text>
      <Text mt={4}>
        {body}
      </Text>
      <Flex mt={2}>
        <IconButton
          onClick={() => setExpanded((prev)=>!prev)}
          isLoading={fetching}
          aria-label="expand bost preview"
          icon={!expanded ? <ChevronDownIcon/> : <ChevronUpIcon />}
          variant="ghost"
          w="100%"
          h="auto"
          py={2}
          m="auto"
        />
      </Flex>
    </Box>
    <EditDeleteBostButtons bostId={bost.id} creatorId={bost.creator.id} />
  </Flex>
}