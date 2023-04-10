import './page.module.css'
import {Container, Grid, Paper} from "@mui/material"
import HeadMenu from "../../components/dashboard/head-menu"
import NavMenu from "../../components/dashboard/nav-menu"
import {menu} from "./menu-items"
import {ReactNode, useState} from "react"

export interface DashboardProps {
    content: ReactNode
}

export default function Dashboard(props: DashboardProps) {
    const [navItems, setNavItems] = useState(menu)

    return <div>
        <HeadMenu/>
        <Grid container>
            <Grid item xs={2}>
                <NavMenu categories={navItems}/>
            </Grid>
            <Grid item xs={10}>
                <Container component="main">
                    <Paper elevation={1} sx={{width: "100%", padding: "20px"}}>
                        {props.content}
                    </Paper>
                </Container>
            </Grid>
        </Grid>
    </div>
}
