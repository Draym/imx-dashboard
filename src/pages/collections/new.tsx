import RequireImx from "@/components/wallet/require-imx"
import {useRouter} from "next/router"
import {ImxContext} from "@/clients/imx/imx-interfaces"
import {Box, Button, CircularProgress, Grid, Stack, Step, StepLabel, Stepper, Tab, TextField, Typography} from "@mui/material"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import {isEmpty, isNotNull} from "@d-lab/common-kit"
import Route from "@/utils/enums/route.enum"
import {useState} from "react"
import {IMXError} from "@imtbl/core-sdk"
import {ErrorHttp} from "@/components/error/errors"
import DeployImxContract from "@/components/contract/deploy-imx-contract"
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos"

export interface NewCollectionProps {
    context: ImxContext
}

function NewCollectionPage(props: NewCollectionProps) {
    const {imx} = props.context
    const router = useRouter()
    const [name, setName] = useState("")
    const [contractAddress, setContractAddress] = useState("")
    const [projectId, setProjectId] = useState("")
    const [description, setDescription] = useState("")
    const [iconUrl, setIconUrl] = useState("")
    const [collectionImageUrl, setCollectionImageUrl] = useState("")
    const [metadataUrl, setMetadataUrl] = useState("")
    const [ownerPublicKey, setOwnerPublicKey] = useState("")
    const [error, setError] = useState<IMXError | undefined>()
    const [submit, setSubmit] = useState(false)
    const [activeStep, setActiveStep] = useState(0)
    const [skipped, setSkipped] = useState(new Set<number>())
    const [deployContractTab, setDeployContractTab] = useState("1")

    const isNotValid = (step: number): boolean => {
        switch (step) {
            case 0:
                return isEmpty(name) || isEmpty(projectId) || isEmpty(ownerPublicKey)
            case 1:
                return isEmpty(contractAddress)
            default:
                return true
        }
    }

    const handleSubmit = () => {
        setSubmit(true)
        imx.createCollection({
            name: name,
            contract_address: contractAddress,
            owner_public_key: ownerPublicKey,
            project_id: parseInt(projectId),
            description: description,
            icon_url: isEmpty(iconUrl) ? undefined : iconUrl,
            collection_image_url: isEmpty(collectionImageUrl) ? undefined : collectionImageUrl,
            metadata_api_url: isEmpty(metadataUrl) ? undefined : metadataUrl,
        }).then(_ => router.push(Route.APP_COLLECTIONS))
            .catch(e => setError(e))
    }

    const verifyPublicKey = () => {
        imx.getPublicKey().then(pub => {
            setOwnerPublicKey(pub)
        })
    }

    const isStepSkipped = (step: number) => {
        return skipped.has(step)
    }

    const nextStep = () => {
        setError(undefined)
        setActiveStep(activeStep + 1)
    }

    const stepBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const step1 = <Grid container>
        <Grid item xs={12}>
            <Typography>IMX Project ID</Typography>
            <TextField
                margin="normal"
                required
                label="project id"
                autoComplete=""
                onChange={(e) => setProjectId(e.target.value)}
                value={projectId}
            />
        </Grid>
        <Grid item xs={12} sx={{marginTop: "5px"}}>
            <Typography>Generate wallet uncompressed public key</Typography>
            <Stack direction="row" spacing={1}>
                <TextField
                    margin="normal"
                    required
                    label="public key"
                    disabled
                    value={ownerPublicKey}
                />
                <Button
                    variant="outlined"
                    onClick={verifyPublicKey}
                    sx={{marginTop: "5px !important", marginBottom: "10px !important"}}
                >
                    <AddToPhotosIcon/>
                </Button>
            </Stack>
        </Grid>
        <Grid container sx={{marginTop: "10px"}}>
            <Grid item xs={5}>
                <Typography>Collection Name</Typography>
                <TextField
                    margin="normal"
                    required
                    id="name"
                    label="name"
                    autoComplete="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </Grid>
            <Grid item xs={7}>
                <Typography>Collection Description</Typography>
                <TextField
                    margin="normal"
                    label="description"
                    autoComplete="description"
                    fullWidth
                    multiline
                    rows={5}
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                />
            </Grid>
        </Grid>
        <Grid item xs={12} sx={{marginTop: "10px"}}>
            <Typography>Collection URLs</Typography>
        </Grid>
        <Grid item xs={12}>
            <TextField
                margin="normal"
                label="Thumbnail url"
                autoComplete="url"
                type="url"
                onChange={(e) => setIconUrl(e.target.value)}
                value={iconUrl}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                margin="normal"
                label="Banner url"
                autoComplete="url"
                type="url"
                onChange={(e) => setIconUrl(e.target.value)}
                value={iconUrl}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                margin="normal"
                label="Metadata url"
                autoComplete="url"
                type="url"
                onChange={(e) => setIconUrl(e.target.value)}
                value={iconUrl}
            />
        </Grid>
        <Grid item xs={12} sx={{marginTop: "10px"}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Button
                    variant="outlined"
                    onClick={stepBack}
                >
                    Back
                </Button>
                <Button
                    variant="outlined"
                    color="success"
                    onClick={nextStep}
                    disabled={isNotValid(activeStep)}
                    sx={{width: "200px"}}
                >Next</Button>
            </Stack>
        </Grid>
    </Grid>

    const step2 = <Grid container>
        <Typography>IMX collection requires an ERC721 SmartContract on Ethereum mainnet to backup users NFTs.</Typography>
        <Grid container>
            <Box sx={{width: '100%', typography: 'body1'}}>
                <TabContext value={deployContractTab}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <TabList onChange={(event, newValue: string) => setDeployContractTab(newValue)} aria-label="Choose your contract">
                            <Tab label="Already have one" value="1"/>
                            <Tab label="New Contract" value="2"/>
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography>You already got an ERC721 IMX compatible contract?</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    label="contract address"
                                    onChange={(e) => setContractAddress(e.target.value)}
                                    value={contractAddress}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value="2">
                        <DeployImxContract setContractAddress={(address) => setContractAddress(address)}/>
                    </TabPanel>
                </TabContext>
            </Box>
        </Grid>
        <Grid item xs={12}>
            <Button
                variant="outlined"
                color="success"
                fullWidth
                onClick={nextStep}
                disabled={isNotValid(activeStep)}
            >Next</Button>
        </Grid>
    </Grid>

    const step3 = <Grid container>
        <Grid item xs={12}>
            <Button
                variant="outlined"
                fullWidth
                onClick={handleSubmit}
                disabled={submit}
            >
                Create Collection
                {submit && <CircularProgress color="inherit" size={20} sx={{marginLeft: "5px"}}/>}
            </Button>
        </Grid>
        {isNotNull(error) && <Grid item xs={12}>
            <ErrorHttp.withTitle error={error!}/>
        </Grid>}
    </Grid>


    const labels = ['Collection Details', 'Contract Deployment', 'Submit']
    const steps = [
        step1,
        step2,
        step3
    ]


    return <Grid container>
        <Grid item xs={12} sx={{marginBottom: "20px"}}>
            <Stepper activeStep={activeStep}>
                {labels.map((label, index) => {
                    const stepProps: { completed?: boolean } = {}
                    if (isStepSkipped(index)) {
                        stepProps.completed = false
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
        </Grid>
        <Grid item xs={12}>
            {activeStep > steps.length ?
                <>
                    <Typography sx={{mt: 2, mb: 1}}>
                        All steps completed - your collection is created on IMX
                    </Typography>
                    <Button variant="outlined" onClick={() => router.push(Route.APP_COLLECTIONS)}>Go To Collections</Button>
                </>
                : steps[activeStep]
            }
        </Grid>
    </Grid>
}

const page = () => <RequireImx target={(context: ImxContext) => <NewCollectionPage context={context}/>}/>
export default page