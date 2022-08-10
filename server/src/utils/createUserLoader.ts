import DataLoader from 'dataloader'
import { User } from '../entities'
import { In } from 'typeorm'

const batchFunc = async(userIds: readonly number[]): Promise<User[]> => {
  const users = await User.findBy({ id: In(userIds as number[])});
  const userMap: Record<number, User> = {}
  users.forEach(u => userMap[u.id] = u)
  return userIds.map((uid) => userMap[uid])
}

export const createUserLoader = () => new DataLoader<number, User>(batchFunc)