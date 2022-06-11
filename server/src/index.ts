import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import mikroOrmConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { BostResolver } from './resolvers/bost'
import { UserResolver } from './resolvers/user'
import { createClient } from "redis"
import connectRedis from 'connect-redis' // if types are not included, this will be red squigglied
import session from "express-session"
import { __prod__ } from './constants'
import { MyContext } from './types'
import cors from 'cors'

const main = async () => {
  // =============== Redis set-up ===============
  const redisClient = createClient({ legacyMode: true })
  redisClient.connect().catch(console.error)
  const RedisStore = connectRedis(session)

  // =============== MikroORM set-up ===============
  const orm = await MikroORM.init(mikroOrmConfig)
  orm.getMigrator().up()

  // =============== MikroORM examples ===============
  // const bost = orm.em.create(Bost, {title: 'test bost'}) // NOT auto-added to db
  // await orm.em.persistAndFlush(bost) // pushed to DB
  // // BUT, the streamlined method...
  // await orm.em.nativeInsert(Bost, {title: 'test bost 2'}) // doesn't autofill data...

  // =============== Express set-up ===============
  const app = express()
  // cors
  app.use(cors({
    origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
    credentials: true
  }))
  // testing home
  app.get('/', (_, res) => {
    res.send('helo from /')
  })
  // GQL server setup
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, BostResolver, UserResolver],
      validate: false,
    }),
    context: ({req, res}): MyContext => {
      return ({em: orm.em, req, res})
    }
  })
  await apolloServer.start()
  // Apply redis middleware...
  app.use(
    session({
      name: 'qid_maybe_depricated', // TODO: i think cookie name
      store: new RedisStore({
        client: redisClient,
        disableTouch: true // TODO: i have no idea what this does
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        // Cookie settings for Webclient
        sameSite: 'lax', // TODO: what does this do
        secure: false // cookie only works in https
        // // Cookie settings for Apollo Sandbox
        // sameSite: 'none',
        // secure: true
      },
      saveUninitialized: false,
      secret: "secret_should_be_hidden",
      resave: false,
    })
  )
  // ...before the Apollo middleware (order matters)
  // TODO: these were needed for the GQL studio
  app.set('trust proxy', !__prod__)
  // TODO: these were needed for the GQL studio
  apolloServer.applyMiddleware({
    app,
    cors: false,
    path: "/graphql"
  })
  // listen at port 4000
  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  })
}

main().catch(err => {console.error(err)})