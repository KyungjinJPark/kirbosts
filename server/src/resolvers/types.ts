import { ObjectType, Field } from "type-graphql"

@ObjectType()
export class FieldError {
  @Field()
  field: string
  @Field()
  message: string // will be displayed to UI
}