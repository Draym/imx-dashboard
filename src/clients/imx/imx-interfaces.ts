import {Signer} from "@wagmi/core"
import {IMXError, StarkSigner} from "@imtbl/core-sdk"
import {ImxSdk} from "@/clients/imx/imx-sdk"

export interface IMXWallet {
    ethSigner: Signer
    starkSigner: StarkSigner
}

export interface ImxContext {
    address: string
    imx: ImxSdk
}

export interface ImxConnect {
    address?: string
    error?: IMXError
    loading: boolean
}

export interface ImxSigner {
    signer?: IMXWallet
    error?: IMXError
    loading: boolean
}

export interface Mint {
    user: string
    model?: number
    quantity: number
}