import { ObjectType, Field, Int } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Comment, Kirb, User } from './'

@ObjectType() // TypeGQL decorator
@Entity() // TypeORM decorator
export class Bost extends BaseEntity {
  // [OptionalProps]?: 'createdAt' | 'updatedAt'

  @Field(() => Int /* `Int` is from TypeGQL... */) // TypeGQL decorator
  @PrimaryGeneratedColumn() // TypeORM decorator
  id!: number // the ! means required

  @Field()
  @Column('text') // default is already 'text'
  title!: string

  @Field()
  @Column('text')
  text!: string

  @Field(() => Int)
  @Column({type: 'int', default: 0})
  kirbCount!: number

  @OneToMany(() => Kirb, (kirb) => kirb.user)
  kirbs: Kirb[]
  
  @OneToMany(() => Comment, (comment) => comment.bost)
  comments: Comment[]

  @Field(() => Int)
  @Column()
  creatorId!: number

  //? I don't think this actually does anything rn b/c when mutation createBost
  //? is called, creator isn't passed in
  //? This is not true, not sure how these connect w no logic on the migration.
  //? could it be autodetecting `error`
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.bosts)
  creator: User

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}