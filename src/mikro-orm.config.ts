import { MikroORM } from '@mikro-orm/core'
import path from 'path';
import { __prod__ } from './constants';
import { Post } from './entities/Post';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pathTs: path.join(__dirname, './migrations'),
    glob: '!(*.d).{js,ts}',
  },
  dbName: 'kirbosts', // `as const` to make type more specific
  user: 'kirbosts',
  password: 'kirbosts',
  allowGlobalContext: true,
  debug: !__prod__,
  type: 'postgresql',
  entities: [Post],
} as Parameters<typeof MikroORM.init>[0]