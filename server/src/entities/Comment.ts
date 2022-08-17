import { ObjectType, Field, Int } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Bost, User } from './'

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column('text')
  text!: string

  @Field(() => Boolean)
  @Column({type: 'boolean', default: false})
  edited!: boolean

  @Field(() => Int)
  @PrimaryColumn()
  bostId!: number

  @Field(() => Bost)
  @ManyToOne(() => Bost, (bost) => bost.comments)
  bost: Bost

  @Field(() => Int)
  @Column()
  creatorId!: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  creator: User

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}