import { useRouter } from "next/router"
import { useBostQuery } from "../generated/graphql"
import { toIntId } from "./toIntId"

export const useGetBostFromUrl = () => {
  const router = useRouter()
  const bostId = toIntId(router.query.id)
  return useBostQuery({
    pause: bostId === -1,
    variables: {
      id: bostId,
    }
  })

}