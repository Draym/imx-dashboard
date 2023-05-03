import {useEffect, useState} from "react"
import {
    AddMetadataSchemaToCollectionRequest,
    Collection,
    Config,
    CreateCollectionRequest,
    CreateProjectRequest,
    CreateProjectResponse,
    createStarkSigner,
    generateLegacyStarkPrivateKey,
    ImmutableX,
    IMXError,
    MintFee,
    MintTokensResponse,
    MintUser,
    Project,
    SuccessResponse,
    UpdateCollectionRequest
} from '@imtbl/core-sdk'
import {Link} from '@imtbl/imx-link-sdk'
import Network from "@/utils/enums/network.enum"
import {useSigner} from "wagmi"
import {isNotNull} from "@d-lab/common-kit"
import {Signer} from "@wagmi/core"
import {extractError} from "@/utils/errors/extract-error"
import {ImxConnect, ImxSigner, IMXWallet, Mint} from "@/clients/imx/imx-interfaces"
import {httpError} from "@/utils/errors/error"
import {ethers} from "ethers"
import imxCache from "@/clients/imx/imx-cache"

export function useIMX(): ImxSdk | null {
    const {data: signer} = useSigner()
    const [imx, setImx] = useState<ImxSdk | null>(null)

    useEffect(() => {
        if (isNotNull(signer)) {
            signer!.getAddress().then(address => {
                signer!.getChainId().then(chainId => {
                    setImx(new ImxSdk(address, chainId, signer!))
                })
            })
        }
    }, [signer])
    return imx
}


export function useImxConnect(imx: ImxSdk | null): ImxConnect {
    const [address, setAddress] = useState<string | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<IMXError | undefined>()

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
                setAddress(undefined)
                setLoading(false)
                setError(e2)
            })
        })
    }, [imx])
    return {address, error, loading}
}

export function useImxSigner(imx: ImxSdk | null): ImxSigner {
    const [signer, setSigner] = useState<IMXWallet | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<IMXError | undefined>()

    useEffect(() => {
        setLoading(true)
        if (isNotNull(imx)) {
            try {
                generateLegacyStarkPrivateKey(imx!.signer).then(starkPrivateKey => {
                    const l2signer = createStarkSigner(starkPrivateKey)
                    setSigner({
                        ethSigner: imx!.signer,
                        starkSigner: l2signer
                    })
                })
            } catch (e) {
                setError({message: extractError(e), code: "0", name: "error"})
                setLoading(false)
            }
        }
    }, [imx])
    return {signer, error, loading}
}

export function useImxCollections(imx: ImxSdk | null, refresh = 1) {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<IMXError | undefined>()

    useEffect(() => {
        setLoading(true)
        if (isNotNull(imx)) {
            imx!.getCollections(refresh == 1).then(response => {
                setCollections(response)
                setLoading(false)
            }).catch(e => {
                setError(e)
                setCollections([])
                setLoading(false)
            })
        }
    }, [imx, refresh])
    return {collections: collections, error, loading}
}

export function useImxProjects(imx: ImxSdk | null, refresh = 1) {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<IMXError | undefined>()

    useEffect(() => {
        setLoading(true)
        if (isNotNull(imx)) {
            imx!.getProjects(refresh == 1).then(response => {
                setProjects(response)
                setLoading(false)
            }).catch(e => {
                setError(e)
                setProjects([])
                setLoading(false)
            })
        }
    }, [imx, refresh])
    return {projects, error, loading}
}

export class ImxSdk {
    address: string
    network: Network
    url: string
    link: Link
    sdk: ImmutableX
    signer: Signer

    constructor(address: string, network: number, signer: Signer) {
        this.signer = signer
        this.address = address
        this.url = network === Network.MAINNET ? process.env.NEXT_PUBLIC_IMX_LINK! : process.env.NEXT_PUBLIC_IMX_LINK_SANDBOX!
        this.network = network
        this.link = new Link(this.url)
        const config = network === Network.MAINNET ? Config.PRODUCTION : Config.SANDBOX
        this.sdk = new ImmutableX(config)
    }

    changeNetwork(network: number) {
        this.url = network === Network.MAINNET ? process.env.NEXT_PUBLIC_IMX_LINK! : process.env.NEXT_PUBLIC_IMX_LINK_SANDBOX!
        this.link = new Link(this.url)
        const config = network === Network.MAINNET ? Config.PRODUCTION : Config.SANDBOX
        this.sdk = new ImmutableX(config)
    }

    async getPublicKey(): Promise<string> {
        const message = "Please sign this message to load your public key into the DApp."
        const signature = await this.signer.signMessage(message)
        const msgHash = ethers.utils.hashMessage(message);
        const msgHashBytes = ethers.utils.arrayify(msgHash);
        return ethers.utils.recoverPublicKey(msgHashBytes, signature)
    }

    async getProjects(useCache = true): Promise<Project[]> {
        if (useCache) {
            const data = imxCache().getProjects(this.address, this.network)
            if (isNotNull(data)) {
                return data!
            }
        }
        const projects: Project[] = []
        let remaining = true
        let cursor = undefined
        while (remaining) {
            let response = await this.sdk.getProjects(this.signer, 1000, cursor)
            projects.push(...response.result)
            remaining = response.remaining != 0
            cursor = response.cursor
        }
        return imxCache().setProjects(this.address, this.network, projects)
    }

    async createProject(request: CreateProjectRequest): Promise<CreateProjectResponse> {
        return await this.sdk.createProject(this.signer, request)
    }

    async getCollections(useCache = true): Promise<Collection[]> {
        if (useCache) {
            const data = imxCache().getCollections(this.address, this.network)
            if (isNotNull(data)) {
                return data!
            }
        }
        const projects = await this.getProjects()
        const projectIds = projects.map(project => project.id)
        const collections: Collection[] = []

        // scan every collection
        // TODO: should try to find a better way with IMX team
        // TODO: maybe can optimise a bit with orderBy projectId
        let remaining = true
        let cursor = undefined
        while (remaining) {
            let response = await this.sdk.listCollections({pageSize: 1000, cursor: cursor})
            response.result.forEach(collection => {
                if (projectIds.includes(collection.project_id)) {
                    collections.push(collection)
                }
            })
            remaining = response.remaining != 0
            cursor = response.cursor
        }
        return imxCache().setCollections(this.address, this.network, collections)
    }

    async createCollection(request: CreateCollectionRequest): Promise<Collection> {
        const response = await this.sdk.createCollection(this.signer, request)
        imxCache().addCollection(this.address, this.network, response)
        return response
    }

    async updateCollection(collectionAddress: string, request: UpdateCollectionRequest): Promise<Collection> {
        const response = await this.sdk.updateCollection(this.signer, collectionAddress, request)
        imxCache().updateCollection(this.address, this.network, response)
        return response
    }

    async addMetadataSchema(collectionAddress: string, request: AddMetadataSchemaToCollectionRequest): Promise<SuccessResponse> {
        return this.sdk.addMetadataSchemaToCollection(this.signer, collectionAddress, request)
    }

    async mintToken(contractAddress: string, mints: Mint[], fees: MintFee[]): Promise<MintTokensResponse> {
        const total = mints.reduce((partialSum, a) => partialSum + a.quantity, 0)
        if (total > 200) {
            throw httpError("Cannot mint more than 200 tokens at once")
        }
        const assets: MintUser[] = []
        return this.sdk.mint(this.signer, {
            contract_address: contractAddress,
            royalties: fees,
            users: assets
        })
    }
}