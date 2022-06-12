import { withUrqlClient } from "next-urql"
import { NavBar } from "../components/NavBar"
import { useBostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

const Index = () => {
  const [{data}] = useBostsQuery()

  return (
    <>
      <NavBar />
      <div>hello world!</div>
      <br />
      {!data
        ? <div>loading...</div>
        : data.bosts.map((bost) => {
          return <div key={bost.id}>{bost.title}</div>
        })
      }
    </>
  )
}

// ssr on bc page has queries & the results are important for SEO
// This causes problems for `NavBar`
export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
