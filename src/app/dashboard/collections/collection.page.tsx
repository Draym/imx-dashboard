import Dashboard from "../page"
import {useParams} from "react-router"

function CollectionPage() {
    const {address} = useParams()

    return <div>Collection page: {address}</div>
}

const page =() => <Dashboard content={<CollectionPage/>}/>
export default page