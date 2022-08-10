import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react"
import NextLink from "next/link" // client side routing
import { useRouter } from "next/router"
import { useLogoutMutation, useMeQuery } from "../generated/graphql"

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter()
  const [{data, fetching}] = useMeQuery()
  const [{fetching: logoutFetching}, logout] = useLogoutMutation()

  let body = null
  if (fetching || data?.me === null) {
    body = (<>
      <NextLink href="/login"><Link color="black">Login</Link></NextLink>
      <NextLink href="/register"><Link ml={2} color="black">Register</Link></NextLink>
    </>)
  } else {
    body = (<Flex align="center">
      <NextLink href="/create-bost"><Button as={Link}>Create a Bost</Button></NextLink>
      <Box ml={2}>{data?.me.username}</Box>
      <Button onClick={async () => {
        await logout()
        router.reload()
      }} isLoading={logoutFetching} variant="link" ml={2}>Logout</Button>
    </Flex>)
  }
  
  return (
    <Box position="sticky" top={0} zIndex={10} bg="tan" >
      <Flex
        maxW="800px"
        mx="auto"
        align="center"
        py={4}
      >
        <NextLink href="/"><Link>
          <Heading>Kirbosts</Heading>
        </Link></NextLink>
        <Box ml={'auto'}>
          {body}
        </Box>
      </Flex>
    </Box>
  )
}