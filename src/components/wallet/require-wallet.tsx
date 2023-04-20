import {ReactNode, useEffect, useState} from "react"
import {useAccount} from "wagmi"
import ConnectWallet from "@/components/wallet/connect-wallet"

export interface RequireWalletProps {
    children: JSX.Element
}

export default function RequireWallet(props: RequireWalletProps): JSX.Element | null{
    const [isMounted, setIsMounted] = useState(false)
    const { isConnected } = useAccount()

    useEffect(() => setIsMounted(true), [])

    if (!isMounted) {
        return null
    } else if (isConnected) {
        return props.children
    } else {
        return <ConnectWallet/>
    }
}