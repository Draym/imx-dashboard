import Dashboard from "../page"
import {useSigner} from "wagmi"
import {Button, Grid, IconButton, Stack, TextField, Typography} from "@mui/material"
import {useState} from "react"
import {isEmpty, isNull} from "@d-lab/common-kit"
import {ethers} from "ethers"
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function CollectionPage() {
    const {data: signer, isError, isLoading} = useSigner()
    const [params, setParams] = useState<string[]>([])
    const [abi, setAbi] = useState("")
    const [bytecode, setBytecode] = useState("")

    const isNotValid = (): boolean => {
        return isEmpty(abi) || isEmpty(bytecode) || isNull(signer)
    }

    const handleSubmit = async () => {
        const factory = new ethers.ContractFactory(abi, bytecode, signer!)
        console.log("submit: ", await signer!.getAddress(), params)
        const contract = await factory.deploy(...params)
        console.log(contract.address);
        console.log(contract.deployTransaction);
    }

    return <Grid container>
        <Typography>Deploy a SmartContract</Typography>
        <Grid container>
            {params.map((param, index) => <Grid item xs={12} key={index}>
                <Stack direction="row" alignItems="center">
                    <TextField
                        margin="normal"
                        required
                        label={`Parameter #${index + 1}`}
                        name="parameter"
                        onChange={(e) => {
                            params[index] = e.target.value
                            setParams([...params])
                        }}
                        value={params[index]}
                    />
                <IconButton
                    onClick={() => {
                        params.splice(index, 1)
                        setParams([...params])
                    }}
                    children={<RemoveCircleOutlineIcon/>}
                />
                </Stack>
                </Grid>
            )}
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    onClick={() => setParams([...params, ""])}
                    sx={{marginTop: "5px", marginBottom: "10px"}}
                >
                    Add Parameter
                </Button>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item xs={6}>
                <Typography>Contract ABI:</Typography>
                <TextField
                    margin="normal"
                    required
                    label="abi"
                    name="ABI"
                    multiline
                    fullWidth
                    maxRows={10}
                    onChange={(e) => setAbi(e.target.value)}
                    value={abi}
                />
            </Grid>
        </Grid>
        <Grid container>
            <Grid item xs={6}>
                <Typography>Contract Byte:</Typography>
                <TextField
                    margin="normal"
                    required
                    label="bytecode"
                    name="Bytecode"
                    multiline
                    fullWidth
                    maxRows={10}
                    onChange={(e) => setBytecode(e.target.value)}
                    value={bytecode}
                />
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={isNotValid()}
                sx={{marginTop: "20px"}}
            >
                Start Deployment
            </Button>
        </Grid>
    </Grid>
}

const page = () => <Dashboard content={<CollectionPage/>}/>
export default page