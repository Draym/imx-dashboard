import {Container, Grid, Paper, Stack} from "@mui/material"
import HeadMenu from "./head-menu"
import NavMenu from "./nav-menu"
import {menu} from "./menu-items"
import {ReactNode, useState} from "react"
import {Web3Button} from "@web3modal/react"
import {useAccount} from "wagmi"
import Route from "@/utils/enums/route.enum"
import {useRouter} from "next/router"

export interface DashboardProps {
    children: JSX.Element
}

export default function Dashboard(props: DashboardProps) {
    return <div>
        <HeadMenu/>
        <Grid container>
            <Grid item xs={2}>
                <NavMenu categories={menu}/>
            </Grid>
            <Grid item xs={10}>
                <Container component="main">
                    <Paper elevation={1} sx={{width: "100%", padding: "20px"}}>
                        {props.children}
                    </Paper>
                </Container>
            </Grid>
        </Grid>
    </div>
}
