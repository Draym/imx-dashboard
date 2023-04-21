import RequireImx from "@/components/wallet/require-imx"
import {useRouter} from "next/router"
import {ImxContext} from "@/clients/imx/imx-interfaces"

export interface NewCollectionProps {
    context: ImxContext
}

function NewCollectionPage(props: NewCollectionProps) {
    const {address} = props.context
    const router = useRouter()

    // if (isNotNull(error)) {
    //     return <ErrorHttp.withTitle error={error!}/>
    // }
    return <div>hi</div>
}

const page = () => <RequireImx target={(context: ImxContext) => <NewCollectionPage context={context}/>}/>
export default page