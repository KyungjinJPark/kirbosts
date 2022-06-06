import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType() // TypeGQL decorator
@Entity() // MikroORM decorator
export class Bost {
  [OptionalProps]?: 'createdAt' | 'updatedAt'

  @Field(() => Int /* `Int` is from TypeGQL... */) // TypeGQL decorator
  @PrimaryKey() // MikroORM decorator
  id!: number // !: required

  @Field()
  @Property()
  createdAt: Date = new Date()

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Field()
  @Property({type: 'text'})
  title!: string
}