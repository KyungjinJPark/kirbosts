import { ObjectType, Field, Int } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Bost, Kirb } from './'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  // [OptionalProps]?: 'createdAt' | 'updatedAt'

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({type: 'text', unique: true})
  email!: string

  @Field()
  @Column({type: 'text', unique: true})
  username!: string

  // removing `@Field` bc I don't want ppl querying other ppl's passwords
  @Column({type: 'text'})
  password!: string

  @OneToMany(() => Bost, (bost) => bost.creator)
  bosts: Bost[]

  @OneToMany(() => Kirb, (kirb) => kirb.user)
  kirbs: Kirb[]

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}