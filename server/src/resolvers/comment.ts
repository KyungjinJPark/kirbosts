import { MyContext } from 'src/types'
import { Comment, User } from '../entities'
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { isAuth } from '../middleware/isAuth'
import { FieldError } from './types'

@InputType()
class CreateCommentInput {
  @Field()
  bostId: number
  @Field()
  text: string
}

@InputType()
class UpdateCommentInput {
  @Field()
  commentId: number
  @Field()
  bostId: number
  @Field()
  text: string
}

@InputType()
class DeleteCommentInput {
  @Field()
  commentId: number
  @Field()
  bostId: number
}

@ObjectType()
export class CommentResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]
  @Field(() => Comment, {nullable: true})
  comment?: Comment
}

// @ObjectType()
// class PaginatedBosts {
//   @Field(() => [Bost])
//   bosts: Bost[]
//   @Field(() => Boolean)
//   hasMore: boolean
// }

// @ObjectType()
// export class TextSnippetResponse {
//   @Field()
//   snippet: string
//   @Field(() => Boolean)
//   hasMore: boolean
// }

@Resolver(Comment)
export class CommentResolver { 
  // =============== CREATE ===============
  @Mutation(() => CommentResponse)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg('input') input: CreateCommentInput,
    @Ctx() {req}: MyContext
  ): Promise<CommentResponse> {
    input.text = input.text.trim()
    const errors = this.getCommentContentErrors(input.text)
    if (errors.length !== 0) {
      return {errors}
    } else {
      return {comment: await Comment.create({...input, creatorId: req.session.userId}).save()}
    }
  }

  // =============== READ ===============
  @FieldResolver(() => User)
  async creator(
    @Root() root: Comment,
    @Ctx() {userLoader}: MyContext,
    ) {
    return userLoader.load(root.creatorId)
  }

  @Query(() => [Comment])
  async allCommentsByBostId(
    @Arg('bostId', () => Int) bostId: number,
  ): Promise<Comment[]> {
    const qb = Comment
      .createQueryBuilder('c')
      .where('"bostId" = :bostId', {bostId})
      .orderBy('c.createdAt', 'DESC')
      .getMany()
    return qb
  }
  
  // @Query(() => PaginatedBosts) // Bost was not a GQL type will I added the decorators to `.../entities/Bost.ts`
  // async comments(
  //   @Arg('limit', () => Int) limit: number,
  //   @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
  // ): Promise<PaginatedBosts> { // duplicate typing necessary
  //   const count = Math.min(limit, 10)
  //   const countExtra = count + 1

  //   const qb = Bost
  //     .createQueryBuilder('b')
  //     .orderBy('b.createdAt', 'DESC') // doesn't work with "s around createdAt
  //   if (cursor) {
  //     qb.where('b."createdAt" < :cursor', { cursor: new Date(cursor) })
  //   }

  //   const bosts = await qb.take(countExtra).getMany()
  //   return {bosts: bosts.slice(0, count), hasMore: bosts.length === countExtra}
  // }

  // =============== UPDATE ===============
  @Mutation(() => CommentResponse)
  @UseMiddleware(isAuth)
  async updateComment(
    @Arg('input', () => UpdateCommentInput) {commentId, bostId, text}: UpdateCommentInput,
    @Ctx() {req}: MyContext
  ): Promise<CommentResponse> {
    const comment = await Comment.findOne({where: {
      id: commentId,
      bostId,
      creatorId: req.session.userId,
    }})
    if (comment === null) {
      return {errors: [{field: 'comment', message: `No editable comment found.`}]}
    }
    text = text.trim()
    const errors = this.getCommentContentErrors(text)
    if (errors.length !== 0) {
      return {errors}
    } else {
      return { comment: await Comment
        .createQueryBuilder()
        .update()
        .set({text, edited: true})
        .where(
          'id = :id AND bostId = :bostId AND creatorId = :creatorId',
          {id:commentId, bostId, creatorId: req.session.userId}
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
  async deleteComment(
    @Arg('input', () => DeleteCommentInput) {commentId, bostId}: DeleteCommentInput,
    @Ctx() {req}: MyContext,
  ): Promise<boolean> {
    const comment = await Comment.findOneBy({id: commentId, bostId})
    if (!comment || comment.creatorId !== req.session.userId) {
      return false
    }
    await Comment.delete({id: commentId, bostId})
    return true
  }

  // =============== HELPERS ===============
  getCommentContentErrors(text: string) {
    const errors = []
    if (text.length === 0) {
      errors.push({ field: 'text', message: 'Bost body cannot be empty.' })
    } else if (text.length > 2000) {
      errors.push({ field: 'text', message: 'Bost body must be 2000 characters or less.' })
    }
    return errors
  }
}

