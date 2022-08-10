import { Request, Response } from "express"
import Redis from "ioredis"
import { DataSource } from "typeorm"
import { createKirbLoader } from "./utils/createKirbLoader"
import { createUserLoader } from "./utils/createUserLoader"

export type MyContext = {
  ds: DataSource,
  redis: Redis,
  req: Request & { session: { userId?: number } },
  res: Response,
  userLoader: ReturnType<typeof createUserLoader>
  kirbLoader: ReturnType<typeof createKirbLoader>
}