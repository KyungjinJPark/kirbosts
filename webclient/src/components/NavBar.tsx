import { Box, Button, Flex, Heading, Text, Link, Switch, useColorMode } from "@chakra-ui/react"
import NextLink from "next/link" // client side routing
import { useRouter } from "next/router"
import { useLogoutMutation, useMeQuery } from "../generated/graphql"

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter()
  const [{data, fetching}] = useMeQuery()
  const [{fetching: logoutFetching}, logout] = useLogoutMutation()
  const { colorMode, toggleColorMode } = useColorMode()

  let body = null
  if (fetching || data?.me === null) {
    body = (<>
      <NextLink href="/login"><Link>Login</Link></NextLink>
      <NextLink href="/register"><Link ml={2}>Register</Link></NextLink>
    </>)
  } else {
    body = (<>
      <NextLink href="/create-bost"><Button as={Link}>Create a Bost</Button></NextLink>
      <Box ml={4}>{data?.me.username}</Box>
      <Button onClick={async () => {
        await logout()
        router.reload()
      }} isLoading={logoutFetching} variant="link" ml={2} colorScheme="black">Logout</Button>
    </>)
  }
  
  return (
    <Box
      position="sticky"
      top={0}
      zIndex={10}
      bg={colorMode === 'light' ? "purple.300" : "purple.900"}
    >
      <Flex
        maxW="800px"
        mx="auto"
        align="center"
        py={4}
      >
        <Flex align={"end"}>
          <NextLink href="/"><Link mr={2}>
            <Heading>Kirbosts</Heading>
          </Link></NextLink>
          <Text
            fontSize="xl"
            bgGradient="linear(to-r, #FF0080, yellow.400)"
            bgClip="text"
            fontWeight="bold"
          >v0.0.0.0.1</Text>
        </Flex>
        <Box ml={'auto'}>
          <Flex align="center">
            {body}
            <Switch
              id='isChecked'
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
              colorScheme="blackAlpha"
              size='lg'
              ml={4}
            />
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}