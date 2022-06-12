import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  return errors.reduce((acc, {field, message}) => {
    acc[field] = message
    return acc
  }, {})
}