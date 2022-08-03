import { DataSource } from "typeorm";
import path from 'path';
import { __prod__ } from './constants';
import { Bost } from './entities/Bost';
import { User } from './entities/User';

export default {
  // allowGlobalContext: true,
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: 'kirbosts', // `as const` to make type more specific
  username: 'kirbosts',
  password: 'kirbosts',
  logging: true,
  synchronize: !__prod__,
  entities: [Bost, User],
  migrations: [path.join(__dirname, './migrations/*')]
} as ConstructorParameters<typeof DataSource>[0]