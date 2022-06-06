import { Bost } from '../entities/Bost';
import { MyContext } from '../types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';

@Resolver()
export class BostResolver { 
  // =============== CREATE ===============
  @Mutation(() => Bost)
  async createBost(
    @Arg('title') title: string,
    @Ctx() {em}: MyContext
  ): Promise<Bost> {
    const bost = em.create(Bost, {title})
    await em.persistAndFlush(bost)
    return bost
  }

  // =============== READ ===============
  @Query(() => [Bost]) // Bost was not a GQL type will I added the decorators to `.../entities/Bost.ts`
  bosts(@Ctx() {em}: MyContext): Promise<Bost[]> { // duplicate typing necessary
    return em.find(Bost, {})
  }

  @Query(() => Bost /* can't to `| null` */, {nullable: true})
  bost(
    @Arg('id', () => Int) id: number, // arg1, `Int` needed. Float type inferred
    @Ctx() {em}: MyContext // arg2
  ): Promise<Bost | null> {
    return em.findOne(Bost, {id}) // where by default
  }

  // =============== UPDATE ===============
  @Mutation(() => Bost, {nullable: true})
  async updateBost(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string,
    @Ctx() {em}: MyContext
  ): Promise<Bost | null> { // ig every return is still a for GQL
    const bost = await em.findOne(Bost, {id})
    if (bost === null) {
      return null
    }
    bost.title = title
    await em.persistAndFlush(bost)
    return bost
  }

  // =============== DELETE ===============
  @Mutation(() => Boolean)
  async deleteBost(
    @Arg('id', () => Int) id: number,
    @Ctx() {em}: MyContext
  ): Promise<boolean> { // ig every return is still a for GQL
    await em.nativeDelete(Bost, {id})
    return true // TODO: assumes the delete worked
  }
}