import { DataSource } from 'typeorm'
import path from 'path'
import { __prod__ } from './constants'
import { Bost, Comment, Kirb, User } from './entities'

export default {
  // allowGlobalContext: true,
  type: 'postgres', // `as const` to make type more specific
  url: process.env.DATABASE_URL,
  logging: true,
  synchronize: !__prod__,
  entities: [
    Bost,
    Comment,
    Kirb,
    User,
  ],
  migrations: [path.join(__dirname, './migrations/*')]
} as ConstructorParameters<typeof DataSource>[0]