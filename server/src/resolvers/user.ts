import { MyContext } from '../types';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2'

// alternate way to define arguments
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

// way to define output
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]
  @Field(() => User, {nullable: true})
  user?: User
}

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string // will be displayed to UI
}

// TODO: user IDs increment even on failed register attempts
@Resolver()
export class UserResolver { 
  @Query(() => User, {nullable: true})
  async me(
    @Ctx() {em, req}: MyContext
  ) {
    // not logged in
    const userId = req.session.userId
    if (req.session.userId === undefined) {
      return null
    }
    
    const user = await em.findOne(User, {id: userId})
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    if (options.username.length < 3) {
      return {
        errors: [{
          field: 'username',
          message: 'Username must have at least 3 characters.'
        }]
      }
    }
    if (options.password.length < 8) {
      return {
        errors: [{
          field: 'password',
          message: 'Password must have at least 8 characters.'
        }]
      }
    }
    const hashedPassword = await argon2.hash(options.password)
    const user = em.create(User, {username: options.username, password: hashedPassword})
    try {
      /*
      // INSERT USING QUERY BUILDER
      const result = await (em as EntityManager) // From mikroORM/psql
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          created_at: new Date(), // need real database column names and mORM changes them
          updated_at: new Date(), // need to manually set `new Date()` bc nor created thorugh mORM
        })
        .returning("*") grab all columns
      user = result[0]
      */
      await em.persistAndFlush(user)
    } catch (err) {
      // Username already taken
      switch (err.code) {
        case '23505':
          return {
            errors: [{
              field: 'username',
              message: 'Username already taken.'
            }]
          }
          break;
        default:
          return {
            errors: [{
              field: 'n/a',
              message: 'Unexpected error has occurred!'
            }]
          }
          break;
      }
    }
    // Store `UserId` in the session storage
    req.session.userId = user.id
    return {user}
  }

  @Mutation(() => UserResponse) // TODO: should this be a `Query`?
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {username: options.username})
    if (user === null) {
      return {
        errors: [{
          field: 'username',
          message: 'Username does not exist.'
        }]
      }
    }
    const valid = await argon2.verify(user.password, options.password)
    if (!valid) {
      return {
        errors: [{
          field: 'password',
          message: 'Password is wrong boi.'
        }]
      }
    }
    // Log-in success. Store `UserId` in the session storage
    req.session.userId = user.id
    return {user}
  }
}