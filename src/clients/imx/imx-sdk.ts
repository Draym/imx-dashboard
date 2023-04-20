import {useEffect, useState} from "react"
import {Config, ImmutableX} from '@imtbl/core-sdk'
import {Link} from '@imtbl/imx-link-sdk'
import Network from "@/utils/enums/network.enum"
import {useSigner} from "wagmi"
import {isNotNull} from "@d-lab/common-kit"

export interface ImxAuth {
    address: string
    starkPublicKey: string
    ethNetwork: string
    providerPreference: string
    email?: string
}

export function useIMX(): ImxSdk | null {
    const {data: signer} = useSigner()
    const [imx, setImx] = useState<ImxSdk | null>(null)

    useEffect(() => {
        if (isNotNull(signer)) {
            signer!.getAddress().then(address => {
                signer!.getChainId().then(chainId => {
                    setImx(new ImxSdk(address, chainId))
                })
            })
        }
    }, [signer])
    return imx
}


export function useImxConnect(imx: ImxSdk | null): { auth: ImxAuth | null, loading: boolean } {
    const [auth, setAuth] = useState<ImxAuth | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        console.log("use link", imx?.link)
        console.log("window: ", window)
        
        imx?.sdk.getUser(imx?.address).then(response => {
            console.log("user: ", response.accounts)
        }).catch(e => {
            imx?.link.setup({}).then(response => {
                console.log("auth:", response)
                // @ts-ignore
                setAuth(response)
                setLoading(false)
            })
        })
    }, [imx])
    return {auth, loading}
}

export class ImxSdk {
    address: string
    url: string
    link: Link
    sdk: ImmutableX

    constructor(address: string, network: number) {
        this.address = address
        this.url = network === Network.MAINNET ? process.env.NEXT_PUBLIC_IMX_LINK! : process.env.NEXT_PUBLIC_IMX_LINK_SANDBOX!
        this.link = new Link(this.url)
        const config = network === Network.MAINNET ? Config.PRODUCTION : Config.SANDBOX
        this.sdk = new ImmutableX(config)
    }

    changeNetwork(network: number) {
        this.url = network === Network.MAINNET ? process.env.NEXT_PUBLIC_IMX_LINK! : process.env.NEXT_PUBLIC_IMX_LINK_SANDBOX!
        this.link = new Link(this.url)
    }
}