import { MikroORM } from '@mikro-orm/core'
import { Post } from './entities/Post'
import mikroOrmConfig from './mikro-orm.config'

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig)
  orm.getMigrator().up()

  const post = orm.em.create(Post, {title: 'test post'}) // NOT auto-added to db
  await orm.em.persistAndFlush(post) // pushed to DB
  // BUT, the streamlined method...
  // await orm.em.nativeInsert(Post, {title: 'test post 2'}) // doesn't autofill data...
}

main()