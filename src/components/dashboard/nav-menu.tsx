import {Divider, List, Paper, Stack, Typography} from "@mui/material"
import {ReactElement} from "react"
import {isNotNull} from "@d-lab/common-kit";
import NavMenuItem from "./nav-menu-item"
import "./menu.css"

export interface MenuCategory {
    id: number,
    icon: ReactElement | null
    title: string | null
    items: MenuItem[]
}

export interface MenuItem {
    id: number,
    icon: ReactElement | null
    title: string
    target: string | null
    children: MenuItem[]
}

export interface NavMenuProps {
    categories: MenuCategory[]
}

export default function NavMenu(props: NavMenuProps) {

    return <Paper elevation={0}>
        <List component="nav">
            {
                props.categories.map((category, index) => {
                    return <div key={category.id}>
                        <Stack key={category.id + "_title"} className="mt-1 ml-3" direction="row" spacing={1}>
                            {isNotNull(category.icon) ? category.icon : null}
                            {isNotNull(category.title) ? <Typography>{category.title}</Typography> : null}
                        </Stack>
                        <NavMenuItem items={category.items}/>
                        {index < props.categories.length - 1 ? <Divider/> : null}
                    </div>
                })
            }
        </List>
    </Paper>
}