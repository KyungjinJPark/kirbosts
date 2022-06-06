import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
@Entity()
export class User {
  [OptionalProps]?: 'createdAt' | 'updatedAt'

  @Field(() => Int)
  @PrimaryKey()
  id!: number

  @Field()
  @Property()
  createdAt: Date = new Date()

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Field()
  @Property({type: 'text', unique: true})
  username!: string

  // removing `@Field` bc I don't want ppl querying other ppl's passwords
  @Property({type: 'text'})
  password!: string
}