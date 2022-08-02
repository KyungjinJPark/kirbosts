import { Box, Button, Flex, Link } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { InputField } from "../components/InputField"
import { Wrapper } from "../components/Wrapper"
import { useLoginMutation } from "../generated/graphql"
import { toErrorMap } from "../utils/toErrorMap"
import { createUrqlClient } from "../utils/createUrqlClient"
import NextLink from "next/link";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter()
  const [, login] = useLoginMutation()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{emailOrUsername: "", password: ""}}
        onSubmit={async (vals, {setErrors}) => {
          const response = await login(vals) // password is passed plaintext across the wire
          const data = response.data?.login
          if (data.errors !== null) {
            setErrors(toErrorMap(data.errors))
          } else if (data.user !== null) {
            // success
            const nextQuery = router.query.next
            if (typeof nextQuery === 'string') {
              router.push(nextQuery)
            } else {
              router.push("/")
            }
          }
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <InputField
              name="emailOrUsername"
              label="Email or Username"
              placeholder="Email or Username"
            ></InputField>
            <Box mt={4}>
              <InputField
                type="password"
                name="password"
                label="password"
                placeholder="Password"
              ></InputField>
            </Box>
            <Flex mt={4}>
              <NextLink href="/forgot-password"><Link color="teal.500" ml="auto">Forgot your password?</Link></NextLink>
            </Flex>
            <Button type="submit" isLoading={isSubmitting} mt={4} colorScheme="teal">Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

// ssr off but still need urql client bc there are mutations to call
export default withUrqlClient(createUrqlClient)(Login)