import Dashboard from "../page"
import {useIMX} from "../../../clients/imx/imx-sdk"
import {isNull} from "@d-lab/common-kit"
import Loading from "../../../components/dashboard/loading"

function ProjectsPage() {
    const imx = useIMX()
    const {auth, loading} = imx?.useConnect() || {loading: true}

    if (loading || isNull(auth)) {
        return <Loading/>
    }
    return <div>Projects page: welcome {auth!.address}</div>
}

const page = () => <Dashboard content={<ProjectsPage/>}/>
export default page