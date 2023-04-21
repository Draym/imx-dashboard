import {useEffect, useState} from "react"
import {Config, ImmutableX} from '@imtbl/core-sdk'
import {Link} from '@imtbl/imx-link-sdk'
import Network from "@/utils/enums/network.enum"
import {useSigner} from "wagmi"
import {isNotNull} from "@d-lab/common-kit"

export interface ImxContext {
    address: string
}

export interface ImxConnect {
    address?: string
    error?: string
    loading: boolean
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


export function useImxConnect(imx: ImxSdk | null): ImxConnect {
    const [address, setAddress] = useState<string | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | undefined>()

    useEffect(() => {
        setLoading(true)
        imx?.sdk.getUser(imx?.address).then(_ => {
            setAddress(imx!.address)
            setError(undefined)
            setLoading(false)
        }).catch(e => {
            setLoading(true)
            imx?.link.setup({}).then(response => {
                setAddress(response.address)
                setError(undefined)
                setLoading(false)
            }).catch(e2 => {
                setLoading(false)
                setError(e2.message)
            })
        })
    }, [imx])
    return {address, error, loading}
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