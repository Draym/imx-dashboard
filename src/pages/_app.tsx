import Dashboard from '@/components/dashboard/layout'
import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import React from "react"
import {CssBaseline, ThemeProvider} from "@mui/material"
import {darkTheme} from "@/theme/dark-theme"
import {EthereumClient, w3mConnectors, w3mProvider,} from "@web3modal/ethereum";
import {Web3Modal} from "@web3modal/react";
import {goerli, mainnet} from "wagmi/chains";
import {configureChains, createClient, WagmiConfig} from "wagmi";

const chains = [goerli, mainnet];
const projectId = "373509f2a0b9e947ca4aa41e39ec1bc6";

const {provider} = configureChains(chains, [w3mProvider({projectId})]);
const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({projectId, version: 1, chains}),
    provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);
export default function App({Component, pageProps}: AppProps) {
    return <div><WagmiConfig client={wagmiClient}>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Dashboard>
                <Component {...pageProps} />
            </Dashboard>
        </ThemeProvider>
    </WagmiConfig>
        <Web3Modal
            projectId={projectId}
            ethereumClient={ethereumClient}
            themeMode="dark"
            themeVariables={{
                "--w3m-font-family": '"Courier New", Courier, monospace',
                "--w3m-accent-color": "transparent",
                "--w3m-background-color": "#000",
                "--w3m-button-border-radius": "0",
                "--w3m-container-border-radius": "0",
            }}
        />
    </div>
}
