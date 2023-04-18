import { Stack, Button } from "@mui/material"
import Dashboard from "../../page"
import {useNavigate} from "react-router"
import Path from "../../../../routes/path.enum"

function CollectionsPage() {
    const navigate = useNavigate()
    return <Stack direction="row" alignItems="center">
        <Button onClick={() => navigate(Path.APP_CONTRACT_DEPLOY_Imx)}>IMX Contract</Button>
        <Button onClick={() => navigate(Path.APP_CONTRACT_DEPLOY_Custom)}>Custom Contract</Button>
    </Stack>
}

const page =() => <Dashboard content={<CollectionsPage/>}/>
export default page