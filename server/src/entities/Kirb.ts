import { Field, Int } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Bost, User } from './'

// @ObjectType()
@Entity()
export class Kirb extends BaseEntity {
  @Field(() => Int)
  @Column()
  value: number

  @Field(() => Int)
  @PrimaryColumn()
  userId: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.kirbs)
  user: User

  @Field(() => Int)
  @PrimaryColumn()
  bostId: number

  @Field(() => Bost)
  @ManyToOne(() => Bost, (bost) => bost.kirbs)
  bost: Bost
}