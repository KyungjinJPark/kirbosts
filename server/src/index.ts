import 'reflect-metadata'
import 'dotenv-safe/config'
import typeOrmConfig from './type-orm.config'
import { DataSource } from "typeorm";
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { BostResolver } from './resolvers/bost'
import { CommentResolver } from './resolvers/comment'
import { UserResolver } from './resolvers/user'
import Redis from 'ioredis'
import connectRedis from 'connect-redis' // if types are not included, this will be red squigglied
import session from "express-session"
import { COOKIE_NAME, __prod__ } from './constants'
import { MyContext } from './types'
import cors from 'cors'
import { createUserLoader } from './utils/createUserLoader'
import { createKirbLoader } from './utils/createKirbLoader'
// import { Bost, Kirb, User } from './entities'

const main = async () => {
  // =============== Redis set-up ===============
  const redis = new Redis(process.env.REDIS_URL)
  const RedisStore = connectRedis(session)

  // =============== TypeORM set-up ===============
  const ds = new DataSource(typeOrmConfig)
  await ds.initialize()
  .then(() => {
    // // here you can start to work with your database
    // // delete all bosts
    // Bost.delete({})
    // // delete all users
    // User.delete({})
    // // delete all kirbs
    // Kirb.delete({})
  })
  .catch((error) => console.log(error))
  // // ds.dropDatabase()
  // ds.runMigrations()

  // =============== old MikroORM examples ===============
  // const bost = orm.em.create(Bost, {title: 'test bost'}) // NOT auto-added to db
  // await orm.em.persistAndFlush(bost) // pushed to DB
  // // BUT, the streamlined method...
  // await orm.em.nativeInsert(Bost, {title: 'test bost 2'}) // doesn't autofill data...

  // =============== Express set-up ===============
  const app = express()
  // cors
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(' '),
    credentials: true
  }))
  // testing home
  app.get('/', (_, res) => {
    res.send('helo from /')
  })
  // GQL server setup
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, BostResolver, CommentResolver, UserResolver],
      validate: false,
    }),
    context: ({req, res}): MyContext => {
      return ({ds, redis, req, res,
        userLoader: createUserLoader(), // init every new req
        kirbLoader: createKirbLoader(),
      })
    }
  })
  await apolloServer.start()
  // Apply redis middleware...
  app.use(
    session({
      name: COOKIE_NAME, // TODO: i think cookie name
      store: new RedisStore({
        client: redis,
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
      secret: process.env.REDIS_SESSION_SECRET,
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
  // listen at port `${process.env.MW_PORT}`
  app.listen(parseInt(process.env.MW_PORT), () => {
    console.log(`server started on port ${process.env.MW_PORT}`);
  })
}

main().catch(err => {console.error(err)})