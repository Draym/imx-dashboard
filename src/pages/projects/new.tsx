import RequireImx from "@/components/wallet/require-imx"
import {useRouter} from "next/router"
import {ImxContext} from "@/clients/imx/imx-interfaces"
import {Button, CircularProgress, Grid, TextField, Typography} from "@mui/material"
import {isEmpty, isNotNull} from "@d-lab/common-kit"
import Route from "@/utils/enums/route.enum"
import {useState} from "react"
import {IMXError} from "@imtbl/core-sdk"
import {ErrorHttp} from "@/components/error/errors"

export interface NewProjectProps {
    context: ImxContext
}

function NewProjectPage(props: NewProjectProps) {
    const {imx} = props.context
    const router = useRouter()
    const [name, setName] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [error, setError] = useState<IMXError | undefined>()
    const [submit, setSubmit] = useState(false)

    const isNotValid = (): boolean => {
        return isEmpty(name) || isEmpty(companyName) || isEmpty(contactEmail)
    }

    const handleSubmit = () => {
        setSubmit(true)
        imx.createProject({
            company_name: companyName,
            contact_email: contactEmail,
            name: name
        }).then(_ => router.push(Route.APP_PROJECTS))
            .catch(e => setError(e))
    }
    if (isNotNull(error)) {
        return <ErrorHttp.withTitle error={error!}/>
    }
    return <Grid container>
        <Typography>Create a new Project</Typography>
        <Grid item xs={12}>
            <Typography>Name</Typography>
            <TextField
                className="mt-5"
                margin="normal"
                required
                id="name"
                label="name"
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
            />
        </Grid>
        <Grid item xs={12}>
            <Typography>Contact Email</Typography>
            <TextField
                className="mt-5"
                margin="normal"
                required
                label="email"
                autoComplete="email"
                type="email"
                onChange={(e) => setContactEmail(e.target.value)}
                value={contactEmail}
            />
        </Grid>
        <Grid item xs={12}>
            <Typography>Company Name</Typography>
            <TextField
                className="mt-5"
                margin="normal"
                required
                label="name"
                autoComplete="name"
                onChange={(e) => setCompanyName(e.target.value)}
                value={companyName}
            />
        </Grid>
        <Grid item xs={12}>
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isNotValid() || submit}
            >
                Create
                {submit && <CircularProgress color="inherit"/>}
            </Button>
        </Grid>
    </Grid>
}

const page = () => <RequireImx target={(context: ImxContext) => <NewProjectPage context={context}/>}/>
export default page