import {Button} from "@mui/material"
import {useNavigate} from "react-router"

export default function Page404() {
    let navigate = useNavigate()

    return <div className="content">
        <div className="container-fluid">
            <h2>Oups you are lost</h2>
            <Button variant="outlined" onClick={() => navigate("/")}>
                Bring me back
            </Button>
        </div>
    </div>
}