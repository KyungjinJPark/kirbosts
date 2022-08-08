import { Request, Response } from "express"
import Redis from "ioredis"
import { DataSource } from "typeorm"

export type MyContext = {
  ds: DataSource,
  redis: Redis,
  req: Request & { session: { userId?: number } },
  res: Response,
}