import {Collection, Project} from "@imtbl/core-sdk"
import {isEmpty} from "@d-lab/common-kit"
import Network from "@/utils/enums/network.enum"

type UserMap<T> = { [key: string]: T[] }
type NetworkMap<T> = { [key: number]: T }

type ProjectCache = NetworkMap<UserMap<Project>>
type CollectionCache = NetworkMap<UserMap<Collection>>

class ImxCache {
    private readonly projects: ProjectCache
    private readonly collections: CollectionCache

    private readonly networks = [Network.GOERLI, Network.MAINNET]

    private readonly keys = {
        projects: "imx.{network}-projects",
        collections: "imx.{network}-collections"
    }

    constructor() {
        this.projects = {}
        this.collections = {}
        this.networks.forEach(network => {
            this.projects[network] = this.loadProjects(network)
            this.collections[network] = this.loadCollections(network)
        })
    }

    private loadProjects(network: Network): UserMap<Project> {
        const data = localStorage.getItem(this.key("projects", network))
        if (isEmpty(data)) {
            return {}
        }
        return JSON.parse(data!)
    }

    private loadCollections(network: Network): UserMap<Collection> {
        const data = localStorage.getItem(this.key("collections", network))
        if (isEmpty(data)) {
            return {}
        }
        return JSON.parse(data!)
    }

    private key(key: "projects" | "collections", network: Network): string {
        return this.keys[key].replace("{network}", network.toString())
    }

    getProjects(wallet: string, network: Network): Project[] | null {
        return this.projects[network][wallet]
    }

    getCollections(wallet: string, network: Network): Collection[] | null {
        return this.collections[network][wallet]
    }

    setProjects(wallet: string, network: Network, projects: Project[]): Project[] {
        this.projects[network][wallet] = projects
        localStorage.setItem(this.key("projects", network), JSON.stringify(this.projects[network]))
        return this.projects[network][wallet]
    }

    setCollections(wallet: string, network: Network, collections: Collection[]): Collection[] {
        this.collections[network][wallet] = collections
        localStorage.setItem(this.key("collections", network), JSON.stringify(this.collections[network]))
        return this.collections[network][wallet]
    }
}

let cache: ImxCache | undefined;
export default function imxCache(): ImxCache {
    if (!cache) {
        cache = new ImxCache()
    }
    return cache;
}