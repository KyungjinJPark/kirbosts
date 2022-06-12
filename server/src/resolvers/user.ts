import { MyContext } from '../types';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2'
import { COOKIE_NAME, EMAIL_REGEX, FORGOT_PASSWORD_PREFIX } from '../constants';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid'

// alternate way to define arguments
@InputType()
class RegisterInput {
  @Field()
  email: string
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
    @Arg('options') options: RegisterInput,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    if (!options.email.match(EMAIL_REGEX)) {
      return {
        errors: [{
          field: 'email',
          message: 'Email must be valid.'
        }]
      }
    }
    if (options.username.length < 3) {
      return {
        errors: [{
          field: 'username',
          message: 'Username must have at least 3 characters.'
        }]
      }
    }
    if (options.username.match(EMAIL_REGEX)) {
      return {
        errors: [{
          field: 'username',
          message: 'Username cannot be in email format.'
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
    const user = em.create(User, {email: options.email, username: options.username, password: hashedPassword})
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

  @Mutation(() => UserResponse) // should this be a `Query`? No. This mutates the state of redis
  async login(
    @Arg('emailOrUsername') emailOrUsername: string,
    @Arg('password') password: string,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    let user
    if (emailOrUsername.match(EMAIL_REGEX)) {
      user = await em.findOne(User, {email: emailOrUsername})
      if (user === null) {
        return {
          errors: [{
            field: 'emailOrUsername',
            message: 'Email does not exist.'
          }]
        }
      }
    } else {
      user = await em.findOne(User, {username: emailOrUsername})
      if (user === null) {
        return {
          errors: [{
            field: 'emailOrUsername',
            message: 'Username does not exist.'
          }]
        }
      }
    }
    const valid = await argon2.verify(user.password, password)
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

  @Mutation(() => Boolean)
  logout(
    @Ctx() {req, res}: MyContext
  ): Promise<boolean> {
    res.clearCookie(COOKIE_NAME)
    return new Promise(res => req.session.destroy(err => {
      if (err === null || err === undefined) {
        console.log(err)
        res(false)
      } else {
        res(true)
      }
    }))
  }
  
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() {em, redis}: MyContext
  ): Promise<boolean> {
    const user = await em.findOne(User, {email})
    if (user === null) {
      return true
    }

    const token = v4()
    await redis.set(FORGOT_PASSWORD_PREFIX + token, user.id, "EX", 360 * 24)
    await sendEmail(
      user.email,
      `<p>Hey</p>
      <p><a href="http://localhost:3000/forgot-password/${token}">
        can i ask you for a quick favor?
      </a></p>`
    )
    return true
  }
}