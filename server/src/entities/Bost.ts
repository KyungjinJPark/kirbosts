import { ObjectType, Field, Int } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@ObjectType() // TypeGQL decorator
@Entity() // TypeORM decorator
export class Bost extends BaseEntity {
  // [OptionalProps]?: 'createdAt' | 'updatedAt'

  @Field(() => Int /* `Int` is from TypeGQL... */) // TypeGQL decorator
  @PrimaryGeneratedColumn() // TypeORM decorator
  id!: number // !: required

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date

  @Field()
  @Column('text') // default is already 'text'
  title!: string
}