import {useEffect, useState} from "react"
import {ImxContext, useIMX, useImxConnect} from "@/clients/imx/imx-sdk"
import {isNotNull, isNull} from "@d-lab/common-kit"
import Loading from "@/components/dashboard/loading"
import {Error} from "@/components/errors/error"
import RequireWallet from "@/components/wallet/require-wallet"

export interface RequireIMXProps {
    target: (context: ImxContext) => JSX.Element
}

function RequireIMX(props: RequireIMXProps): JSX.Element | null {
    const [isMounted, setIsMounted] = useState(false)
    const imx = useIMX()
    const {address, error, loading} = useImxConnect(imx)

    useEffect(() => setIsMounted(true), [])

    if (!isMounted) {
        return null
    } else if (isNotNull(error)) {
        return <Error.message error={error!}></Error.message>
    } else if (loading || isNull(address)) {
        return <Loading/>
    } else {
        return props.target({address: address!})
    }
}

const component = (props: RequireIMXProps) => <RequireWallet><RequireIMX {...props}/></RequireWallet>
export default component