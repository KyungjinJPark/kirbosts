import { Box, Button } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { InputField } from "../../../components/InputField"
import { Layout } from "../../../components/Layout"
import { useUpdateBostMutation } from "../../../generated/graphql"
import { createUrqlClient } from "../../../utils/createUrqlClient"
import { useIsAuth } from "../../../utils/useIsAuth"
import { useGetBostFromUrl } from "../../../utils/useGetBostFromUrl";
import { useRouter } from "next/router"
import { toIntId } from "../../../utils/toIntId"

interface createBostProps {}

const EditBost: React.FC<createBostProps> = ({}) => {
  useIsAuth()
  const router = useRouter()
  const bostId = toIntId(router.query.id)
  const [{data, error, fetching}] = useGetBostFromUrl()
  const [, updateBost] = useUpdateBostMutation()

  if (fetching) {
    return <Layout>
      Loading...
    </Layout>
  }

  if (error) {
    return <Layout>
      {error.message}
    </Layout>
  }

  if (!data.bost) {
    return <Layout>
      Bost does not exist.
    </Layout>
  }

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{title: data.bost.title, text: data.bost.text}}
        onSubmit={async (vals) => {
          const response = await updateBost({id: bostId, ...vals})
          // POG: automatic cache updates when updateMutation hook used
          if (!response.error) {
            router.back()
          }
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
            <Button type="submit" isLoading={isSubmitting} mt={4} colorScheme="teal">Finish Editing</Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(EditBost)
