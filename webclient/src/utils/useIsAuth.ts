import { useRouter } from "next/router"
import { useEffect } from "react"
import { useMeQuery } from "../generated/graphql"

export const useIsAuth = () => { //TODO: is this a security vulnerability?
  const router = useRouter()
  const [{data, fetching}] = useMeQuery()
  useEffect(() => { // go to login if not logged in
    if (!fetching && !data.me) {
      router.replace(`/login?next=${router.pathname}`)
    }
  }, [data, fetching, router])
}