import {useImxCollections} from "@/clients/imx/imx-sdk"
import RequireImx from "@/components/wallet/require-imx"
import {Button, Grid, Typography} from "@mui/material"
import {DataGrid, GridColDef} from '@mui/x-data-grid'
import {useRouter} from "next/router"
import Route from "@/utils/enums/route.enum"
import {useState} from "react"
import {isNotNull} from "@d-lab/common-kit"
import {ErrorHttp} from "@/components/error/errors"
import {ImxContext} from "@/clients/imx/imx-interfaces"

export interface CollectionsPageProps {
    context: ImxContext
}

function CollectionsPage(props: CollectionsPageProps) {
    const {address} = props.context
    const {collections, loading, error} = useImxCollections(props.context.imx)
    const router = useRouter()
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 0,
    })

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 90},
        {field: 'address', headerName: 'Address', width: 90},
        {field: 'name', headerName: 'Name', width: 150},
        {field: 'project_id', headerName: 'Project ID', width: 150},
        {field: 'metadata_api_url', headerName: 'Metadata', width: 150},
        {field: 'icon_url', headerName: 'Icon', width: 150},
        {field: 'collection_image_url', headerName: 'Image', width: 150}
    ]
    return <Grid container>
        <Grid container alignItems="center" sx={{marginBottom: "20px"}}>
            <Grid item>
                <Typography>Collections of {address}:</Typography>
            </Grid>
            <Grid item flex={1}/>
            <Grid item>
                <Button variant="outlined" onClick={() => router.push(Route.APP_COLLECTIONS_Create)}>New Collection</Button>
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <DataGrid
                rows={collections}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
                loading={loading}
                autoHeight
            />
        </Grid>
        {isNotNull(error) && <Grid item xs={12}>
            <ErrorHttp.withTitle error={error!}/>
        </Grid>}
    </Grid>
}

const page = () => <RequireImx target={(context: ImxContext) => <CollectionsPage context={context}/>}/>
export default page