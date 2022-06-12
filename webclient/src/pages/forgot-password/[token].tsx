import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";

const ForgotPassword: NextPage<{token: string}> = ({token}) => {
  const [, changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState("")
  return (
    <Wrapper variant="small">
      {tokenError !== "" && <Alert
        status='error'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        mb={4}
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={2} mb={1} fontSize='lg'>
          Unexpected Error
        </AlertTitle>
        <AlertDescription maxWidth='sm'>
          {tokenError}
          <br />
          <NextLink href="/forgot-password"><Link color="teal.500">Request a new token.</Link></NextLink>
        </AlertDescription>
      </Alert>}
      <Formik
        initialValues={{newPassword: "", retypedPassword: ""}}
        onSubmit={async (vals, {setErrors}) => {
          const response = await changePassword({token, ...vals}) // password is passed plaintext across the wire
          const data = response.data?.changePassword
          if (data.errors !== null) {
            const {token, ...errMap} = toErrorMap(data.errors) as any
            if (token !== undefined) {
              setTokenError(token)
            }
            setErrors(errMap)
          } else if (data.user !== null) {
            // success
            router.push("/")
          }
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <InputField
              type="password"
              name="newPassword"
              label="new password"
              placeholder="New password"
            ></InputField>
            <Box mt={4}>
              <InputField
                type="password"
                name="retypedPassword"
                label="retype password"
                placeholder="Retype password"
              ></InputField>
            </Box>
            <Button type="submit" isLoading={isSubmitting} mt={4} colorScheme="teal">Change Password</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
)
}

ForgotPassword.getInitialProps = ({query}) => {
  return {token: query.token as string}
}

export default withUrqlClient(createUrqlClient, {ssr: false /* may bautomatically `true` when `getInitialProps` is used */})(ForgotPassword)