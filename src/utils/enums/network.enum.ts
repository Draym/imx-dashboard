enum Network {
    MAINNET = 1,
    GOERLI = 5
}

export const networkName = (network: Network): string => {
    switch (network) {
        case Network.MAINNET:
            return "mainnet"
        case Network.GOERLI:
            return "goerli"
        default:
            return "none"
    }
}

export default Network