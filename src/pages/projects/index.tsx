import {useImxProjects} from "@/clients/imx/imx-sdk"
import RequireImx from "@/components/wallet/require-imx"
import {Button, Grid, Typography} from "@mui/material"
import {DataGrid, GridColDef} from '@mui/x-data-grid'
import {useRouter} from "next/router"
import Route from "@/utils/enums/route.enum"
import {useState} from "react"
import {isNotNull} from "@d-lab/common-kit"
import {ErrorHttp} from "@/components/error/errors"
import {ImxContext} from "@/clients/imx/imx-interfaces"

export interface ProjectsPageProps {
    context: ImxContext
}

function ProjectsPage(props: ProjectsPageProps) {
    const {address} = props.context
    const [run, setRefresh] = useState(1)
    const {projects, loading, error} = useImxProjects(props.context.imx, run)
    const router = useRouter()

    const refresh = () => {
        setRefresh(run + 1)
    }

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 90},
        {field: 'name', headerName: 'Name', width: 150},
        {field: 'contact_email', headerName: 'Email', width: 150},
        {field: 'company_name', headerName: 'Company Name', width: 150},
        {field: 'mint_remaining', headerName: 'Remaining Mint', width: 150}
    ]
    if (isNotNull(error)) {
        return <ErrorHttp.withTitle error={error!}/>
    }
    return <Grid container>
        <Grid container alignItems="center" sx={{marginBottom: "20px"}}>
            <Grid item>
                <Typography>Your Projects:</Typography>
            </Grid>
            <Grid item flex={1}/>
            <Grid item>
                <Button variant="outlined" onClick={() => router.push(Route.APP_PROJECTS_Create)}>New Project</Button>
            </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="flex-end">
            <Button variant="outlined" onClick={refresh} size="small" disabled={loading}>refresh IMX</Button>
        </Grid>
        <Grid item xs={12}>
            <DataGrid
                rows={projects}
                columns={columns}
                disableRowSelectionOnClick
                loading={loading}
                autoHeight
                pagination={undefined}
            />
        </Grid>
    </Grid>
}

const page = () => <RequireImx target={(context: ImxContext) => <ProjectsPage context={context}/>}/>
export default page