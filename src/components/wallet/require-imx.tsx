import {useEffect, useState} from "react"
import {useIMX, useImxConnect} from "@/clients/imx/imx-sdk"
import {isNotNull, isNull} from "@d-lab/common-kit"
import Loading from "@/components/dashboard/loading"
import {ErrorHttp} from "@/components/error/errors"
import RequireWallet from "@/components/wallet/require-wallet"
import {ImxContext} from "@/clients/imx/imx-interfaces"

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
        return <ErrorHttp.message error={error!}></ErrorHttp.message>
    } else if (loading || isNull(address) || isNull(imx)) {
        return <Loading/>
    } else {
        return props.target({address: address!, imx: imx!})
    }
}

const component = (props: RequireIMXProps) => <RequireWallet><RequireIMX {...props}/></RequireWallet>
export default component