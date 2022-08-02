import { ObjectType, Field, Int } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User'

@ObjectType() // TypeGQL decorator
@Entity() // TypeORM decorator
export class Bost extends BaseEntity {
  // [OptionalProps]?: 'createdAt' | 'updatedAt'

  @Field(() => Int /* `Int` is from TypeGQL... */) // TypeGQL decorator
  @PrimaryGeneratedColumn() // TypeORM decorator
  id!: number // !: required

  @Field()
  @Column('text') // default is already 'text'
  title!: string

  @Field()
  @Column('text')
  text!: string

  @Field()
  @Column({type: 'int', default: 0})
  kirbs!: number

  @Field()
  @Column()
  creatorId!: number

  @ManyToOne(() => User, (user) => user.bosts)
  creator: User

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}