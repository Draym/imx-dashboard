import {Collapse, List, ListItemButton, ListItemIcon, ListItemText, Paper} from "@mui/material"
import {useState} from "react"
import {isNotNull} from "@d-lab/common-kit";
import {useNavigate} from "react-router"
import {ExpandLess, ExpandMore} from "@mui/icons-material"
import {MenuItem} from "./nav-menu"

export interface NavMenuItemProps {
    items: MenuItem[]
}

export default function NavMenuItem(props: NavMenuItemProps) {
    const [open, setOpen] = useState<{ [key: string]: boolean }>({});
    const navigate = useNavigate()

    const onClick = (item: MenuItem) => {
        if (item.children.length > 0) {
            setOpen({...open, [item.id]: !open[item.id]})
        } else if (isNotNull(item.target)) {
            navigate(item.target!)
        }
    }

    return <List component="nav">
            {
                props.items.map(item => {
                    return <div key={item.id}>
                        <ListItemButton onClick={() => onClick(item)}>
                            {isNotNull(item.icon) ? <ListItemIcon>{item.icon}</ListItemIcon> : null}
                            <ListItemText primary={item.title}/>
                            {item.children.length > 0 ? (open[item.id] ? <ExpandLess/> : <ExpandMore/>) : null}
                        </ListItemButton>
                        {item.children.length > 0 ?
                            <Collapse in={open[item.id]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.children.map(child => {
                                        return <ListItemButton key={child.id} sx={{pl: 4}} onClick={() => onClick(child)}>
                                            <ListItemIcon>
                                                {child.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={child.title}/>
                                        </ListItemButton>
                                    })}
                                </List>
                            </Collapse> : null}
                    </div>
                })
            }
        </List>
}