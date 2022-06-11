import { Box, Button, Flex, Link } from "@chakra-ui/react"
import NextLink from "next/link" // client side routing
import { useLogoutMutation, useMeQuery } from "../generated/graphql"

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{data, fetching}] = useMeQuery()
  const [{fetching: logoutFetching}, logout] = useLogoutMutation()

  let body = null
  if (fetching || data?.me === null) {
    body = (<>
      <NextLink href="/login"><Link color="black">Login</Link></NextLink>
      <NextLink href="/register"><Link ml={2} color="black">Register</Link></NextLink>
    </>)
  } else {
    body = (<Flex>
      <Box>{data?.me.username}</Box>
      <Button onClick={() => logout()} isLoading={logoutFetching} variant="link" ml={2}>Logout</Button>
    </Flex>)
  }
  
  return (
    <Flex
      bg="tan"
      p={4}
    >
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
  )
}