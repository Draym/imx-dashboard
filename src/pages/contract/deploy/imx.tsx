import RequireWallet from "@/components/wallet/require-wallet"
import DeployImxContract from "@/components/contract/deploy-imx-contract"

function DeployImxContractPage(): JSX.Element {
    return <DeployImxContract/>
}

const page = () => <RequireWallet><DeployImxContractPage/></RequireWallet>
export default page