import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import {CssBaseline, ThemeProvider} from "@mui/material"
import App from "./App"
import {darkTheme} from "./theme/dark-theme"
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

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)
root.render(
    <React.StrictMode>
        <WagmiConfig client={wagmiClient}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <App/>
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
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
