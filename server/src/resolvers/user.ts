import { MyContext } from '../types'
import { Arg, Ctx, Field, FieldResolver, InputType, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { User } from '../entities'
import argon2 from 'argon2'
import { COOKIE_NAME, EMAIL_REGEX, FORGOT_PASSWORD_PREFIX } from '../constants'
import { sendEmail } from '../utils/sendEmail'
import { v4 } from 'uuid'
import { FieldError } from './types'

// way to define output
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]
  @Field(() => User, {nullable: true})
  user?: User
}

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

// TODO: user IDs increment even on failed register attempts
@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(
    @Root() root: User,
    @Ctx() {req}: MyContext,
  ) {
    if (req.session.userId === root.id) {
      return root.email
    }
    return "👻"
  }

  @Query(() => User, {nullable: true})
  async me(
    @Ctx() {req}: MyContext
  ) {
    // not logged in
    const userId = req.session.userId
    if (req.session.userId === undefined) {
      return null
    }
    
    return User.findOneBy({id: userId})
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: RegisterInput,
    @Ctx() {req}: MyContext
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
    let user
    try {
      user = await User.create({email: options.email, username: options.username, password: hashedPassword}).save()
      /*
      // INSERT USING QUERY BUILDER (for MikroORM)
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
    } catch (err) {
      // Username already taken
      switch (err.code) {
        case '23505': // TODO: This is somethimes due to a duplicate email
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
    @Ctx() {req}: MyContext
  ): Promise<UserResponse> {
    let user
    if (emailOrUsername.match(EMAIL_REGEX)) {
      user = await User.findOneBy({email: emailOrUsername})
      if (user === null) {
        return {
          errors: [{
            field: 'emailOrUsername',
            message: 'Email does not exist.'
          }]
        }
      }
    } else {
      user = await User.findOneBy({username: emailOrUsername})
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
        res(true)
      } else {
        console.log(err)
        res(false)
      }
    }))
  }
  
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() {redis}: MyContext
  ): Promise<boolean> {
    const user = await User.findOneBy({email})
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

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Arg('retypedPassword') retypedPassword: string,
    @Ctx() {redis, req}: MyContext
  ): Promise<UserResponse> {
    const completeToken = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(completeToken) 
    if (userId === null) {
      return {
        errors: [{
          field: 'token',
          message: 'Token to change the password is invalid.'
        }]
      }
    }
    if (newPassword !== retypedPassword) {
      return {
        errors: [{
          field: 'retypedPassword',
          message: 'Passwords must match.'
        }]
      }
    }
    if (newPassword.length < 8) {
      return {
        errors: [{
          field: 'newPassword',
          message: 'Password must have at least 8 characters.'
        }]
      }
    }
    // all good
    const parsedUserId = parseInt(userId)
    const user = await User.findOneBy({id: parsedUserId})
    if (user === null) {
      return {
        errors: [{
          field: 'token',
          message: 'User associated with this token no longer exists.'
        }]
      }
    }
    await User.update({id: parsedUserId}, {password: await argon2.hash(newPassword)})
    // Store `UserId` in the session storage
    redis.del(completeToken)
    req.session.userId = user.id
    return {user}
  }
}