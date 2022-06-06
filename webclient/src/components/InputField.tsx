import { InputHTMLAttributes } from "react"
import { useField } from "formik"
import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react"

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string, // field id
  label: string,
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _, // this apparently throws `size` away
  ...props
}) => {
  const [field, {error}] = useField(props)
  return (
    <FormControl isInvalid={/* TODO: !! casts the string to a boolead, how? */!!error /* && form.touched.name */}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      {error
        ? <FormErrorMessage>{error}</FormErrorMessage>
        : null}
    </FormControl>
  )
}