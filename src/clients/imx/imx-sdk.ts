import {useEffect, useState} from "react"
import { Link } from '@imtbl/imx-sdk'
import Network from "../../utils/enums/network"
import {useSigner} from "wagmi"
import {isNotNull} from "@d-lab/common-kit"

export interface ImxAuth {
    address: string
    starkPublicKey: string
    ethNetwork: string
    providerPreference: string
    email?: string
}

export function useIMX() {
    const {data: signer} = useSigner()
    const [sdk, setSdk] = useState<ImxSdk | null>(null)
    useEffect(() => {
        if (isNotNull(signer)) {
            signer!.getChainId().then(chainId => {
                setSdk(new ImxSdk(chainId))
            })
        }
    }, [signer])
    return sdk
}

export class ImxSdk {
    url: string
    link: Link

    constructor(network: number) {
        this.url = network === Network.MAINNET ? process.env.REACT_APP_LINK! : process.env.REACT_APP_LINK_SANDBOX!
        this.link = new Link(this.url)
        this.useConnect = this.useConnect.bind(this)
    }

    changeNetwork(network: number) {
        this.url = network === Network.MAINNET ? process.env.REACT_APP_LINK! : process.env.REACT_APP_LINK_SANDBOX!
        this.link = new Link(this.url)
    }

    useConnect(): {auth: ImxAuth | null, loading: boolean} {
        const [auth, setAuth] = useState<ImxAuth | null>(null)
        const [loading, setLoading] = useState(true)

        useEffect(() => {
            this.link.setup({}).then(response => {
                console.log("auth:", response)
                setAuth(response)
                setLoading(false)
            })
        }, [])

        return {auth, loading}
    }
}