import { Stack, Button } from "@mui/material"
import Route from "@/utils/enums/route.enum"
import {useRouter} from "next/router"

export default function CollectionsPage() {
    const router = useRouter()
    return <Stack direction="row" alignItems="center">
        <Button onClick={() => router.push(Route.APP_CONTRACT_DEPLOY_Imx)}>IMX Contract</Button>
        <Button onClick={() => router.push(Route.APP_CONTRACT_DEPLOY_Custom)}>Custom Contract</Button>
    </Stack>
}