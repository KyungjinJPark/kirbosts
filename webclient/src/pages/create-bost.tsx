import { Box, Button } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { InputField } from "../components/InputField"
import { Layout } from "../components/Layout"
import { useCreateBostMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
// import { toErrorMap } from "../utils/toErrorMap"

interface createBostProps {}

const CreateBost: React.FC<createBostProps> = ({}) => {
  const router = useRouter()
  const [, createBost] = useCreateBostMutation()

  return (
    <Layout variant="small">
      <Formik
        initialValues={{title: "", text: ""}}
        onSubmit={async (vals, {setErrors}) => {
          const response = await createBost({input: vals})
          // const data = response.data?.createBost
          // if (data.errors !== null) {
          //   setErrors(toErrorMap(data.errors))
          // } else if (data.user !== null) {
          //   // success
          //   router.push("/")
          // }
          if (!response.error) {
            router.push("/")
          } // error may be handled by global handler
        }}
      >
        {({isSubmitting}) => (
          <Form>
            <InputField
              name="title"
              label="Title"
              placeholder="Title"
            ></InputField>
            <Box mt={4}>
              <InputField
                name="text"
                label="Body"
                placeholder="Insert your bost body here"
                textarea
              ></InputField>
            </Box>
            <Button type="submit" isLoading={isSubmitting} mt={4} colorScheme="teal">Create Bost</Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreateBost)
