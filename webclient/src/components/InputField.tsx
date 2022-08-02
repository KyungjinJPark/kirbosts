import { InputHTMLAttributes } from "react"
import { useField } from "formik"
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from "@chakra-ui/react"

type InputFieldProps = 
  InputHTMLAttributes<HTMLTextAreaElement>
  & InputHTMLAttributes<HTMLInputElement>
  & {
    name: string, // field id
    label: string,
    textarea?: boolean,
  }

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _, // this apparently throws `size` away
  ...props
}) => {
  const [field, {error}] = useField(props)
  const InputComponent = textarea ? Textarea : Input
  return (
    <FormControl isInvalid={/* TODO: !! casts the string to a boolead, how? */!!error /* && form.touched.name */}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputComponent {...field} {...props} id={field.name} />
      {error
        ? <FormErrorMessage>{error}</FormErrorMessage>
        : null}
    </FormControl>
  )
}