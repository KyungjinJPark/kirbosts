import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const router = useRouter()
  const [, login] = useLoginMutation()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{username: '', password: ''}}
        onSubmit={async (vals, {setErrors}) => {
          const response = await login({options: vals})
          const data = response.data?.login
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
              name="username"
              label='username'
              placeholder='Username'
            ></InputField>
            <Box mt={4}>
              <InputField
                type="password"
                name="password"
                label='password'
                placeholder='Password'
              ></InputField>
            </Box>
            <Button type="submit" isLoading={isSubmitting} mt={4} colorScheme='teal'>Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default login