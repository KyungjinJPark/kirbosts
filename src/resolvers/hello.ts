import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver { 
  @Query(() => String) // TODO: not `string`... huh
  hello() {
    return 'GQL HelloResover helo'
  }
}