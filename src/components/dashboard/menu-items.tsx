import {MenuCategory} from "./nav-menu"
import Route from "@/utils/enums/route.enum"
import StorefrontIcon from '@mui/icons-material/Storefront'
import RedeemIcon from '@mui/icons-material/Redeem'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import PermMediaIcon from '@mui/icons-material/PermMedia'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import QueryStatsIcon from '@mui/icons-material/QueryStats'

export const menu: MenuCategory[] = [
    {
        id: 1,
        icon: null,
        title: "Management",
        items: [
            {
                id: 2,
                icon: <AccountTreeIcon/>,
                title: "Projects",
                target: Route.APP_PROJECTS,
                children: []
            },
            {
                id: 3,
                icon: <PermMediaIcon/>,
                title: "Collections",
                target: Route.APP_COLLECTIONS,
                children: []
            },
            {
                id: 4,
                icon: <FilePresentIcon/>,
                title: "Metadata",
                target: null,
                children: []
            }
        ]
    },
    {
        id: 100,
        icon: null,
        title: "NFT Operation",
        items: [
            {
                id: 101,
                icon: <RedeemIcon/>,
                title: "Airdrop",
                target: null,
                children: []
            },
            {
                id: 102,
                icon: <StorefrontIcon/>,
                title: "Market",
                target: null,
                children: []
            },
            {
                id: 103,
                icon: <QueryStatsIcon/>,
                title: "Sales",
                target: null,
                children: []
            }
        ]
    },
    {
        id: 200,
        icon: null,
        title: "SmartContract",
        items: [
            {
                id: 201,
                icon: <CloudUploadIcon/>,
                title: "Deployment",
                target: Route.APP_CONTRACT_DEPLOY,
                children: []
            }
        ]
    }
]