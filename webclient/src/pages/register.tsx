import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useMutation } from 'urql'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'

interface registerProps {}

const REGISTER_MUT = `mutation Register($username: String!, $password: String!) {
  register(options: { username: $username, password: $password }) {
    errors {
      field
      message
    }
    user {
      id
      username
      createdAt
    }
  }
}`

const register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUT)
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{username: '', password: ''}}
        onSubmit={(vals) => {
          return register(vals)
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
            <Button type="submit" isLoading={isSubmitting} mt={4} colorScheme='teal'>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default register // Next.js needs this