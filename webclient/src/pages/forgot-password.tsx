import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Link } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import { useState } from "react"
import { InputField } from "../components/InputField"
import { Wrapper } from "../components/Wrapper"
import { useForgotPasswordMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface forgotPasswordProps {}

const ForgotPassword: React.FC<forgotPasswordProps> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation()
  const [success, setSuccess] = useState(false)

  return (
    <Wrapper variant="small">
      {success && <Alert
        status='success'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        mb={4}
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={2} mb={1} fontSize='lg'>
          Password reset email sent!
        </AlertTitle>
        <AlertDescription maxWidth='sm'>
          If that email is valid, a message with a link to reset the account's password has been sent.
          <br />
          <NextLink href="/login"><Link color="teal.500">Take me to the Login page.</Link></NextLink>
        </AlertDescription>
      </Alert>}
      <Formik
        initialValues={{email: ""}}
        onSubmit={async (vals, {setErrors}) => {
          const response = await forgotPassword(vals)
          const data = response.data.forgotPassword
          setSuccess(data)
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
            <Button type="submit" isLoading={isSubmitting} mt={4} colorScheme="teal">Send Email</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

// ssr off but still need urql client bc there are mutations to call
export default withUrqlClient(createUrqlClient)(ForgotPassword)
