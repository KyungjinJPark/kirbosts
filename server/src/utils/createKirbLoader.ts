import DataLoader from "dataloader"
import { Kirb } from "../entities/Kirb"
import { In } from "typeorm";

const batchFunc = async(kirbIds: readonly {bostId: number, userId: number}[]): Promise<Kirb[]> => {
  const bostIds = kirbIds.map((kids) => kids.bostId)
  const userIds = kirbIds.map((kids) => kids.userId)
  const kirbs = await Kirb.findBy({ bostId: In(bostIds), userId: In(userIds)});
  const kirbMap: Record<string, Kirb> = {}
  kirbs.forEach(k => kirbMap[`${k.bostId},${k.userId}`] = k)
  return kirbIds.map((k) => kirbMap[`${k.bostId},${k.userId}`])
}

export const createKirbLoader = () => new DataLoader<{bostId: number, userId: number}, Kirb | null>(batchFunc)