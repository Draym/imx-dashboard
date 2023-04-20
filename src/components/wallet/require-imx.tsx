import {useEffect, useState} from "react"
import {useAccount} from "wagmi"
import ConnectIMX from "@/components/wallet/connect-imx"

export interface RequireIMXProps {
    children: JSX.Element
}

export default function RequireIMX(props: RequireIMXProps): JSX.Element | null{
    const [isMounted, setIsMounted] = useState(false)
    const { isConnected } = useAccount()

    useEffect(() => setIsMounted(true), [])

    if (!isMounted) {
        return null
    } else if (isConnected) {
        return props.children
    } else {
        return <ConnectIMX/>
    }
}