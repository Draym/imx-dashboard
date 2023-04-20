import {Button} from "@mui/material"
import { useRouter } from "next/router"
import Route from "@/utils/enums/route.enum"

export default function Page404() {
    let router = useRouter()

    return <div className="content">
        <div className="container-fluid">
            <h2>Oups you are lost</h2>
            <Button variant="outlined" onClick={() => router.push(Route.HOME)}>
                Bring me back
            </Button>
        </div>
    </div>
}