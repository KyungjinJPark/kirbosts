import { Button, Flex } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { InputField } from "./InputField"
import { CommentsQuery, useCreateCommentMutation, useUpdateCommentMutation } from "../generated/graphql"
import { toErrorMap } from "../utils/toErrorMap"

interface CommentCreateFormProps {
  bostId: number,
  editing?: boolean,
  editingComment?: CommentsQuery['allCommentsByBostId'][0],
  cancelEdit?: () => void,
}

export const CommentCreateForm: React.FC<CommentCreateFormProps> = ({
  bostId,
  editing = false,
  editingComment,
  cancelEdit,
}) => {
  const [, createComment] = useCreateCommentMutation()
  const [, updateComment] = useUpdateCommentMutation()

  const initVals = editing ? {text: editingComment.text} : {text: ''}
  const buttonText = ['Cancel', editing ? 'Finish Editing' : 'Create Comment']

  return <Formik
    initialValues={initVals}
    onSubmit={async (vals, {setErrors}) => {      
      if (editing) {
        const {data: {updateComment: data}} = await updateComment({
          input: {
            ...vals,
            bostId,
            commentId: editingComment.id,
          }
        })
        if (data.errors !== null) {
          setErrors(toErrorMap(data.errors))
        } else if (data.comment !== null) {
          cancelEdit()
        }
      } else {
        const {data: {createComment: data}} = await createComment({input: {...vals, bostId}})
        if (data.errors !== null) {
          setErrors(toErrorMap(data.errors))
        } else if (data.comment !== null) {
          // collapse create form
        }
      }
    }}
  >
    {({isSubmitting}) => (
      <Form>
        <InputField
          name="text"
          label={editing ? undefined : "Comment"}
          placeholder="Insert your bost body here"
          textarea
        ></InputField>
        <Flex mt={4} flexDir="row-reverse" justifyContent="space-between">
          <Button type="submit" isLoading={isSubmitting} colorScheme="teal">{buttonText[1]}</Button>
          {!editing
            ? null
            : <Button onClick={cancelEdit} colorScheme="gray">{buttonText[0]}</Button>}
        </Flex>
      </Form>
    )}
  </Formik>
}