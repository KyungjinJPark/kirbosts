import { MyContext } from 'src/types'
import { Bost, Kirb, User } from '../entities'
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { isAuth } from '../middleware/isAuth'
import { FieldError } from './types'

@InputType()
class BostInput {
  @Field()
  title: string
  @Field()
  text: string
}

@ObjectType()
export class BostResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]
  @Field(() => Bost, {nullable: true})
  bost?: Bost
}

@ObjectType()
class PaginatedBosts {
  @Field(() => [Bost])
  bosts: Bost[]
  @Field(() => Boolean)
  hasMore: boolean
}

@ObjectType()
export class TextSnippetResponse {
  @Field()
  snippet: string
  @Field(() => Boolean)
  hasMore: boolean
}

@Resolver(Bost)
export class BostResolver { 
  // =============== CREATE ===============
  @Mutation(() => BostResponse)
  @UseMiddleware(isAuth)
  async createBost(
    @Arg('input') input: BostInput,
    @Ctx() {req}: MyContext
  ): Promise<BostResponse> {
    input.title = input.title.trim()
    input.text = input.text.trim()
    const errors = this.getBostContentErrors(input.title, input.text)
    if (errors.length !== 0) {
      return {errors}
    } else {
      return {bost: await Bost.create({...input, creatorId: req.session.userId}).save()}
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('bostId', () => Int) bostId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() {ds, req}: MyContext,
  ): Promise<boolean> {
    const {userId} = req.session
    const deltaKirb = value === 1 ? 1 : -1
    const prevKirb = await Kirb.findOneBy({bostId, userId})

    await ds.transaction(async (tem) => {
      //? again, does this not use `user` & `bost`
      if (prevKirb) {
        if (prevKirb.value === deltaKirb) {
          await Kirb.delete({userId, bostId})
          await Bost.update({id: bostId}, {
            kirbCount: () => `"kirbCount" - ${deltaKirb}`,
          })
        } else {
          await tem.update(Kirb, {userId, bostId}, {value: deltaKirb})
          await tem.update(Bost, {id: bostId}, {
            kirbCount: () => `"kirbCount" + ${2 * deltaKirb}`,
          })
        }
      } else {
        await tem.insert(Kirb, {userId, bostId, value: deltaKirb})
        await tem.update(Bost, {id: bostId}, {
          kirbCount: () => `"kirbCount" + ${deltaKirb}`,
        })
      }
      
    })
    return true
  }

  // =============== READ ===============
  // GQL computed field : good for performance (usually) b/c they are only run
  // when the data is actually included in the query
  @FieldResolver(() => TextSnippetResponse)
  textSnippet(
    @Root() root: Bost
  ): TextSnippetResponse {
    if (root.text.length <= 80) {
      return {snippet: root.text, hasMore: false}
    } else {
      return {snippet: root.text.slice(0, 80) + "...", hasMore: true}
    }
  }

  @FieldResolver(() => Int)
  async kirbStatus(
    @Root() root: Bost,
    @Ctx() {req, kirbLoader}: MyContext,
  ) {
    if (req.session.userId) {
      const kirb = await kirbLoader.load({bostId: root.id, userId: req.session.userId})
      return kirb ? kirb.value : 0
    }
    return 0
  }

  @FieldResolver(() => User)
  async creator(
    @Root() root: Bost,
    @Ctx() {userLoader}: MyContext,
    ) {
    return userLoader.load(root.creatorId) // cache-adjacent for server ?is that true?
  }
  
  @Query(() => PaginatedBosts) // Bost was not a GQL type will I added the decorators to `.../entities/Bost.ts`
  async bosts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
  ): Promise<PaginatedBosts> { // duplicate typing necessary
    const count = Math.min(limit, 10)
    const countExtra = count + 1

    const qb = Bost
      .createQueryBuilder('b')
      .orderBy('b.createdAt', 'DESC') // doesn't work with "s around createdAt
    if (cursor) {
      qb.where('b."createdAt" < :cursor', { cursor: new Date(cursor) })
    }

    const bosts = await qb.take(countExtra).getMany()
    return {bosts: bosts.slice(0, count), hasMore: bosts.length === countExtra}
  }

  @Query(() => Bost /* can't to `| null` */, {nullable: true})
  bost(
    @Arg('id', () => Int) id: number, // arg1, `Int` needed. Float type inferred
  ): Promise<Bost | null> {
    return Bost.findOneBy({id})
  }

  // =============== UPDATE ===============
  @Mutation(() => BostResponse)
  @UseMiddleware(isAuth)
  async updateBost(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string,
    @Arg('text') text: string,
    @Ctx() {req}: MyContext
  ): Promise<BostResponse> { // ig every return is still a for GQL
    const bost = await Bost.findOne({where: {id, creatorId: req.session.userId}}) // eq to findOneBy({id})
    if (bost === null) {
      return {errors: [{field: 'bost', message: `No editable bost found.`}]}
    }
    title = title.trim()
    text = text.trim()
    const errors = this.getBostContentErrors(title, text)
    if (errors.length !== 0) {
      return {errors}
    } else {
      return { bost: await Bost
        .createQueryBuilder()
        .update()
        .set({title, text})
        .where(
          'id = :id AND creatorId = :creatorId',
          {id, creatorId: req.session.userId}
        )
        .returning('*')
        .execute()
        .then((res) => res.raw[0])
      }
    }
  }

  // =============== DELETE ===============
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteBost(
    @Arg('id', () => Int) id: number,
    @Ctx() {req}: MyContext,
  ): Promise<boolean> { // ig every return is still a for GQL
    // delete the kirbs
    const bost = await Bost.findOneBy({id})
    if (!bost) {
      return false
    }
    if (bost.creatorId === req.session.userId) {
      await Kirb.delete({bostId: id})
      await Bost.delete({id})
      return true
    }
    return false
  }

  // =============== HELPERS ===============
  getBostContentErrors(title: string, text: string) {
    const errors = []
    if (title.length === 0) {
      errors.push({ field: 'title', message: 'Title cannot be empty.' })
    } else if (title.length > 120) {
      errors.push({ field: 'title', message: 'Title can only be 120 characters of less.' })
    }
  
    if (text.length === 0) {
      errors.push({ field: 'text', message: 'Bost body cannot be empty.' })
    }
    
    return errors
  }
}

