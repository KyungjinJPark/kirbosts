import { withUrqlClient } from "next-urql"
import BostCreateEditForm from "../components/BostCreateEditForm"
import { createUrqlClient } from "../utils/createUrqlClient"
import { useIsAuth } from "../utils/useIsAuth"

interface createBostProps {}

const CreateBost: React.FC<createBostProps> = ({}) => {
  useIsAuth()

  return (
    <BostCreateEditForm />
  )
}

export default withUrqlClient(createUrqlClient)(CreateBost)
