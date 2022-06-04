import { MikroORM } from '@mikro-orm/core'
import mikroOrmConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig)
  orm.getMigrator().up()

  // =============== MikroORM examples ===============
  // const bost = orm.em.create(Bost, {title: 'test bost'}) // NOT auto-added to db
  // await orm.em.persistAndFlush(bost) // pushed to DB
  // // BUT, the streamlined method...
  // await orm.em.nativeInsert(Bost, {title: 'test bost 2'}) // doesn't autofill data...

  // =============== Express set-up ===============
  const app = express()
  // testing home
  app.get('/', (_, res) => {
    res.send('Home helo')
  })
  // GQL server setup
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    })
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({app})
  // listen at port 4000
  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  })
}

main()