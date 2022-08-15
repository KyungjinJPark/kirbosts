import { Box, Button, Flex } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import { InputField } from "../components/InputField"
import { Layout } from "../components/Layout"
import { BostQuery, useCreateBostMutation, useUpdateBostMutation } from "../generated/graphql"
import { toErrorMap } from "../utils/toErrorMap"

interface BostCreateEditFormProps {
  editing?: boolean,
  editingBost?: BostQuery['bost']
}

const BostCreateEditForm: React.FC<BostCreateEditFormProps> = ({editing, editingBost}) => {
  const router = useRouter()
  const [, updateBost] = useUpdateBostMutation()
  const [, createBost] = useCreateBostMutation()

  const initVals = editing ? {title: editingBost.title, text: editingBost.text} : {title: '', text: ''}
  const buttonText = ['Cancel', editing ? 'Finish Editing' : 'Create Bost']

  return (
    <Layout variant="regular">
      <Formik
        initialValues={initVals}
        onSubmit={async (vals, {setErrors}) => {
          if (editing) {
            const {data: {updateBost: data}} = await updateBost({id: editingBost.id, ...vals})
            if (data.errors !== null) {
              setErrors(toErrorMap(data.errors))
            } else if (data.bost !== null) {
              router.back()
            }
          } else {
            const {data: {createBost: data}} = await createBost({input: vals})
            if (data.errors !== null) {
              setErrors(toErrorMap(data.errors))
            } else if (data.bost !== null) {
              router.push('/')
            }
          }
          // another error may be handled by global handler
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
            <Flex mt={4} justifyContent="space-between">
              <Button onClick={router.back} colorScheme="gray">{buttonText[0]}</Button>
              <Button type="submit" isLoading={isSubmitting} colorScheme="teal">{buttonText[1]}</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default BostCreateEditForm
