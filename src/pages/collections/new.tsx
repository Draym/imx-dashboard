import RequireImx from "@/components/wallet/require-imx"
import {useRouter} from "next/router"
import {ImxContext} from "@/clients/imx/imx-interfaces"
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Tab,
    TextField,
    Typography
} from "@mui/material"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import {isEmpty, isNotEmpty, isNotNull, isNull} from "@d-lab/common-kit"
import Route from "@/utils/enums/route.enum"
import {useEffect, useState} from "react"
import {IMXError, MetadataSchemaRequest, MetadataSchemaRequestTypeEnum} from "@imtbl/core-sdk"
import {Error, ErrorHttp} from "@/components/error/errors"
import DeployImxContract from "@/components/contract/deploy-imx-contract"
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos"
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"
import {JsonViewer} from "@textea/json-viewer"
import {extractError} from "@/utils/errors/extract-error"

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
    const [metadataUrlLoading, setMetadataUrlLoading] = useState(false)
    const [metadataUrlSample, setMetadataUrlSample] = useState<object | undefined>(undefined)
    const [metadataUrlError, setMetadataUrlError] = useState<string | undefined>(undefined)
    const [ownerPublicKey, setOwnerPublicKey] = useState("")
    const [error, setError] = useState<IMXError | undefined>()
    const [submit, setSubmit] = useState(false)
    const [activeStep, setActiveStep] = useState(0)
    const [skipped, setSkipped] = useState(new Set<number>())
    const [deployContractTab, setDeployContractTab] = useState("1")
    const [metadataSchema, setMetadataSchema] = useState<MetadataSchemaRequest[]>([])

    useEffect(() => {
        if (isNotEmpty(metadataUrl)) {
            setMetadataUrlLoading(true)
            fetch(metadataUrl + "1")
                .then(response => {
                    response.json().then(data => {
                        setMetadataUrlSample(data)
                        setMetadataUrlLoading(false)
                        setMetadataUrlError(undefined)
                    }).catch(e => {
                        setMetadataUrlSample(undefined)
                        setMetadataUrlLoading(false)
                        setMetadataUrlError(extractError(e))
                    })
                }).catch(e => {
                setMetadataUrlSample(undefined)
                setMetadataUrlLoading(false)
                setMetadataUrlError(extractError(e))
            })
        }
    }, [metadataUrl])

    const isNotValid = (step: number): boolean => {
        switch (step) {
            case 0:
                return isEmpty(name) || isEmpty(projectId) || isEmpty(ownerPublicKey) || isNull(metadataUrlSample)
            case 1:
                return isEmpty(contractAddress)
            default:
                return true
        }
    }

    const handleSubmitCollection = () => {
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
        }).then(_ => {
            setSubmit(false)
            nextStep()
        }).catch(e => {
            setError(e)
            setSubmit(false)
        })
    }

    const handleSubmitMetadataSchema = () => {
        setSubmit(true)
        imx.addMetadataSchema(contractAddress, {metadata: metadataSchema.filter(it => isNotEmpty(it.name))})
            .then(_ => {
                setSubmit(false)
                nextStep()
            }).catch(e => {
            setError(e)
            setSubmit(false)
        })
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
                onChange={(e) => setCollectionImageUrl(e.target.value)}
                value={collectionImageUrl}
            />
        </Grid>
        <Grid item xs={12}>
            <Stack direction="column">
                <TextField
                    margin="normal"
                    label="Metadata url"
                    autoComplete="url"
                    type="url"
                    onChange={(e) => setMetadataUrl(e.target.value)}
                    value={metadataUrl}
                    disabled={metadataUrlLoading}
                />
                {metadataUrlLoading && <Stack direction="row">Loading Metadata <CircularProgress size={30} sx={{marginLeft: "5px"}}/></Stack>}
                {isNotNull(metadataUrlError) && <Error.message error={metadataUrlError!} center={false}/>}
                {!metadataUrlLoading && isNotNull(metadataUrlSample) && <Paper elevation={1} sx={{padding: "5px"}}>
                    <Typography>Your Collection Metadata for ID[1]</Typography>
                    <JsonViewer value={metadataUrlSample} theme="dark" maxDisplayLength={4}/>
                </Paper>}
            </Stack>
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
        <Grid item xs={12} sx={{marginTop: "10px"}}>
            <Button
                variant="outlined"
                fullWidth
                onClick={handleSubmitCollection}
                disabled={submit}
            >
                Create Collection on IMX
                {submit && <CircularProgress color="inherit" size={20} sx={{marginLeft: "5px"}}/>}
            </Button>
        </Grid>
        {isNotNull(error) && <Grid item xs={12}>
            <ErrorHttp.withTitle error={error!}/>
        </Grid>}
    </Grid>

    const step4 = <Grid container>
        <Typography>To enable metadata display and filtering on IMX marketplaces, you need to register every attributes of your NFT here</Typography>
        <Grid container>
            <Grid item xs={6}>
                {metadataSchema.map((param, index) => <Grid item xs={12} key={index}>
                        <Stack direction="row" alignItems="center">
                            <TextField
                                margin="normal"
                                required
                                label={`Parameter #${index + 1}`}
                                name="parameter"
                                onChange={(e) => {
                                    metadataSchema[index] = {
                                        ...metadataSchema[index],
                                        name: e.target.value
                                    }
                                    setMetadataSchema([...metadataSchema])
                                }}
                                value={param.name}
                            />
                            <FormControl sx={{marginLeft: 1, minWidth: 80}} size="small">
                                <InputLabel id="param-type-label">Type</InputLabel>
                                <Select
                                    labelId="param-type-label"
                                    id="param-type"
                                    value={param.type}
                                    label="Type"
                                    onChange={(e) => {
                                        metadataSchema[index] = {
                                            ...metadataSchema[index],
                                            type: e.target.value as MetadataSchemaRequestTypeEnum
                                        }
                                        setMetadataSchema([...metadataSchema])
                                    }}
                                >
                                    <MenuItem value={"enum"}>Enum</MenuItem>
                                    <MenuItem value={"text"}>Text</MenuItem>
                                    <MenuItem value={"boolean"}>Boolean</MenuItem>
                                    <MenuItem value={"continuous"}>Continuous</MenuItem>
                                    <MenuItem value={"discrete"}>Discrete</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{marginLeft: 1, minWidth: 110}} size="small">
                                <InputLabel id="param-filterable-label">Filterable</InputLabel>
                                <Select
                                    labelId="param-filterable-label"
                                    id="param-filterable"
                                    value={param.type}
                                    label="Filterable"
                                    onChange={(e) => {
                                        metadataSchema[index] = {
                                            ...metadataSchema[index],
                                            filterable: e.target.value == "yes"
                                        }
                                        setMetadataSchema([...metadataSchema])
                                    }}
                                >
                                    <MenuItem value={"yes"}>Yes</MenuItem>
                                    <MenuItem value={"no"}>No</MenuItem>
                                </Select>
                            </FormControl>
                            <IconButton
                                onClick={() => {
                                    metadataSchema.splice(index, 1)
                                    setMetadataSchema([...metadataSchema])
                                }}>
                                <RemoveCircleOutlineIcon/>
                            </IconButton>
                        </Stack>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        onClick={() => setMetadataSchema([...metadataSchema, {name: ""}])}
                        sx={{marginTop: "5px", marginBottom: "10px"}}
                    >
                        Add Metadata Field
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Paper elevation={1} sx={{padding: "5px"}}>
                    <Typography>Your Collection Metadata for ID[1]</Typography>
                    <JsonViewer value={metadataUrlSample} theme="dark" maxDisplayLength={4}/>
                </Paper>
            </Grid>
        </Grid>
        <Grid item xs={12} sx={{marginTop: "10px"}}>
            <Button
                variant="outlined"
                fullWidth
                onClick={handleSubmitMetadataSchema}
                disabled={submit}
            >
                Submit Metadata on IMX
                {submit && <CircularProgress color="inherit" size={20} sx={{marginLeft: "5px"}}/>}
            </Button>
        </Grid>
        {
            isNotNull(error) && <Grid item xs={12}>
                <ErrorHttp.withTitle error={error!}/>
            </Grid>
        }
    </Grid>

    const labels = ['Collection Details', 'Contract Deployment', 'Submit Collection', 'Metadata']
    const steps = [
        step1,
        step2,
        step3,
        step4
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
                <Stack direction="column">
                    <Typography sx={{mt: 2, mb: 1}}>All steps completed - your collection is created on IMX</Typography>
                    <Typography sx={{mt: 2}}>Name: {name}</Typography>
                    <Typography sx={{mt: 2}}>Address: {contractAddress}</Typography>
                    <Button sx={{mt: 2, mb: 1}} variant="outlined" onClick={() => router.push(Route.APP_COLLECTIONS)}>Go To Collections</Button>
                </Stack>
                : steps[activeStep]
            }
        </Grid>
    </Grid>
}

const page = () => <RequireImx target={(context: ImxContext) => <NewCollectionPage context={context}/>}/>
export default page