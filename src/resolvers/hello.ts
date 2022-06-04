import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver { 
  @Query(() => String) // TODO: not `string`... huh. Not included in TGQL
  hello() {
    return 'helo from HelloResolver'
  }
}