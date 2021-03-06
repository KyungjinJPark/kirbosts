import { Box, Button, Flex, Link } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { InputField } from "../components/InputField"
import { Wrapper } from "../components/Wrapper"
import { useRegisterMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { toErrorMap } from "../utils/toErrorMap"
import NextLink from "next/link";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [, register] = useRegisterMutation()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{email: "", username: "", password: ""}}
        onSubmit={async (vals, {setErrors}) => {
          const response = await register({options: vals})
          const data = response.data?.register
          if (data.errors !== null) {
            setErrors(toErrorMap(data.errors))
          } else if (data.user !== null) {
            // success
            router.push("/")
          }
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <InputField
              type="email"
              name="email"
              label="email"
              placeholder="Email"
            ></InputField>
            <Box mt={4}>
              <InputField
                name="username"
                label="username"
                placeholder="Username"
              ></InputField>
            </Box>
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
            <Button type="submit" isLoading={isSubmitting} mt={4} colorScheme="teal">Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Register)