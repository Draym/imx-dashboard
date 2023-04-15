import './page.module.css'
import {Container, Grid, Paper, Stack} from "@mui/material"
import HeadMenu from "../../components/dashboard/head-menu"
import NavMenu from "../../components/dashboard/nav-menu"
import {menu} from "./menu-items"
import {ReactNode, useState} from "react"
import {Web3Button} from "@web3modal/react"
import {useAccount} from "wagmi"

export interface DashboardProps {
    content: ReactNode
}

export default function Dashboard(props: DashboardProps) {
    const [navItems, setNavItems] = useState(menu)
    const { isConnected, address } = useAccount()

    const connectWallet = <Stack alignItems="center">
        <Web3Button icon="hide" />
    </Stack>

    return <div>
        <HeadMenu/>
        <Grid container>
            <Grid item xs={2}>
                <NavMenu categories={navItems}/>
            </Grid>
            <Grid item xs={10}>
                <Container component="main">
                    <Paper elevation={1} sx={{width: "100%", padding: "20px"}}>
                        {isConnected ? props.content : connectWallet}
                    </Paper>
                </Container>
            </Grid>
        </Grid>
    </div>
}
