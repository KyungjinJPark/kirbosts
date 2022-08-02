import { Bost } from '../entities/Bost';
import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';

@Resolver()
export class BostResolver { 
  // =============== CREATE ===============
  @Mutation(() => Bost)
  async createBost(
    @Arg('title') title: string,
  ): Promise<Bost> {
    // probably 2 SQL queries
    return Bost.create({title}).save()
  }

  // =============== READ ===============
  @Query(() => [Bost]) // Bost was not a GQL type will I added the decorators to `.../entities/Bost.ts`
  bosts(): Promise<Bost[]> { // duplicate typing necessary
    return Bost.find()
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