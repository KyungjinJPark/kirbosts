import { MyContext } from 'src/types';
import { Bost } from '../entities/Bost';
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';

@InputType()
class BostInput {
  @Field()
  title: string
  @Field()
  text: string
}

@Resolver()
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

  // =============== READ ===============
  @Query(() => [Bost]) // Bost was not a GQL type will I added the decorators to `.../entities/Bost.ts`
  bosts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
  ): Promise<Bost[]> { // duplicate typing necessary
    const count = Math.min(limit, 10)
    const qb = Bost
      .createQueryBuilder('b')
      .orderBy('"createdAt"', 'DESC')
      .take(count)
    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(cursor) })
    }
    return qb.getMany()
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