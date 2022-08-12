import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../../../utils/createUrqlClient"
import { useIsAuth } from "../../../utils/useIsAuth"
import BostCreateEditForm from "../../../components/BostCreateEditForm"
import { Layout } from "../../../components/Layout"
import { useGetBostFromUrl } from "../../../utils/useGetBostFromUrl"

interface createBostProps {}

const EditBost: React.FC<createBostProps> = ({}) => {
  useIsAuth()
  const [{data, error, fetching}] = useGetBostFromUrl()
  
  if (fetching) {
    return <Layout>
      Loading...
    </Layout>
  }

  if (error) {
    return <Layout>
      {error.message}
    </Layout>
  }

  if (!data) {
    return <Layout>
      whut thu...
      <br />
      {data}
    </Layout>
  }

  if (!data.bost) {
    return <Layout>
      Bost does not exist.
    </Layout>
  }

  return (
    <BostCreateEditForm editing editingBost={data.bost}/>
  )
}

export default withUrqlClient(createUrqlClient)(EditBost)
