import {MenuCategory} from "../../components/dashboard/nav-menu"
import Path from "../../routes/path.enum"
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

export const menu: MenuCategory[] = [
    {
        id: 1,
        icon: null,
        title: null,
        items: [
            {
                id: 2,
                icon: <AccountBoxIcon/>,
                title: "Projects",
                target: Path.APP_PROJECTS,
                children: []
            }
        ]
    },
    {
        id: 100,
        icon: null,
        title: null,
        items: [
            {
                id: 101,
                icon: <AccountBalanceWalletIcon/>,
                title: "Collections",
                target: Path.APP_COLLECTIONS,
                children: []
            }
        ]
    }
]