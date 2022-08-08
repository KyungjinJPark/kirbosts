import { MyContext } from 'src/types';
import { Bost } from '../entities/Bost';
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { Kirb } from '../entities/Kirb';

@InputType()
class BostInput {
  @Field()
  title: string
  @Field()
  text: string
}

@ObjectType()
class PaginatedBosts {
  @Field(() => [Bost])
  bosts: Bost[]
  @Field(() => Boolean)
  hasMore: boolean
}

@Resolver(Bost)
export class BostResolver { 
  // =============== CREATE ===============
  @Mutation(() => Bost)
  @UseMiddleware(isAuth)
  async createBost(
    @Arg('input') input: BostInput,
    @Ctx() {req}: MyContext
  ): Promise<Bost> {
    return Bost.create({...input, creatorId: req.session.userId }).save()
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
  @FieldResolver(() => String) // GQL computed field
  textSnippet(
    @Root() root: Bost
  ) {
    return root.text.slice(0, 80) + (root.text.length > 80 ? "..." : "")
  }

  @FieldResolver(() => Int)
  async kirbStatus(
    @Root() root: Bost,
    @Ctx() {req}: MyContext,
  ) {
    if (req.session.userId) {
      const data = await Kirb.findOneBy({bostId: root.id, userId: req.session.userId})
      return data ? data.value : 0
    }
    return 0
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
      .innerJoinAndSelect( // this get called even if creator is not fetched
        'b.creator',
        'u', // user alias
        'u.id = b.creatorId' //? since 'creator isn't used, this is required
      )
      .orderBy('b.createdAt', 'DESC') // doesn't work with "s around createdAt
      .take(countExtra)
    if (cursor) {
      qb.where('b."createdAt" < :cursor', { cursor: new Date(cursor) })
    }

    const bosts = await qb.getMany()
    return {bosts: bosts.slice(0, count), hasMore: bosts.length === countExtra}
  }

  @Query(() => Bost /* can't to `| null` */, {nullable: true})
  bost(
    @Arg('id', () => Int) id: number, // arg1, `Int` needed. Float type inferred
  ): Promise<Bost | null> {
    return Bost.findOneBy({id}) // where by default
  }

  // =============== UPDATE ===============
  @Mutation(() => Bost, {nullable: true})
  async updateBost(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string,
  ): Promise<Bost | null> { // ig every return is still a for GQL
    const bost = await Bost.findOne({where: {id}}) // eq to findOneBy({id})
    if (bost === null) {
      return null
    }
    await Bost.update({id}, {title})
    return bost
  }

  // =============== DELETE ===============
  @Mutation(() => Boolean)
  async deleteBost(
    @Arg('id', () => Int) id: number,
  ): Promise<boolean> { // ig every return is still a for GQL
    await Bost.delete({id})
    return true // TODO: assumes the delete worked
  }
}