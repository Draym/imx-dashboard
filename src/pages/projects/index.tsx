import {useIMX, useImxConnect} from "@/clients/imx/imx-sdk"
import {isNull} from "@d-lab/common-kit"
import Loading from "@/components/dashboard/loading"
import RequireWallet from "@/components/wallet/require-wallet"

function ProjectsPage() {
    const imx = useIMX()
    const {auth, loading} = useImxConnect(imx)

    console.log("imx: ", imx)
    if (loading || isNull(auth)) {
        return <Loading/>
    }
    return <div>Projects page: welcome {auth!.address}</div>
}

const page = () => <RequireWallet><ProjectsPage/></RequireWallet>
export default page