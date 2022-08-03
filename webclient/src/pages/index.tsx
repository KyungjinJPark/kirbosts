import { Link } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import { Layout } from "../components/Layout"
import { useBostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import NextLink from "next/link";

const Index = () => {
  const [{data}] = useBostsQuery({variables: {limit: 2}})

  return (
    <Layout>
      <div>hello world!</div>
      <NextLink href="/create-bost"><Link>Create a bost</Link></NextLink>
      <br />
      {!data
        ? <div>loading...</div>
        : data.bosts.map((bost) => {
          return <div key={bost.id}>{bost.title}</div>
        })
      }
    </Layout>
  )
}

// ssr on bc page has queries & the results are important for SEO
// This causes problems for `NavBar`
export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
