import Dashboard from "../../page"
import {useSigner} from "wagmi"
import {Button, Grid, IconButton, Paper, Stack, TextField, Typography} from "@mui/material"
import {useState} from "react"
import {isEmpty, isNotEmpty, isNull} from "@d-lab/common-kit"
import {ethers} from "ethers"
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function DeployCustomContractPage() {
    const {data: signer, isError, isLoading} = useSigner()
    const [params, setParams] = useState<string[]>([])
    const [abi, setAbi] = useState("")
    const [bytecode, setBytecode] = useState("")
    const [contractAddress, setContractAddress] = useState("")
    const [tx, setTx] = useState("")

    const isNotValid = (): boolean => {
        return isEmpty(abi) || isEmpty(bytecode) || isNull(signer)
    }

    const handleSubmit = async () => {
        const factory = new ethers.ContractFactory(abi, bytecode, signer!)
        const contract = await factory.deploy(...params)
        setContractAddress(contract.address)
        setTx(contract.deployTransaction.hash)
        console.log("transaction: ", contract.deployTransaction)
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
                <Typography>Contract Bytecode:</Typography>
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
        {isNotEmpty(contractAddress) && <Grid item xs={12}>
            <Paper elevation={1}>
                <Typography variant="h6" color="green">Contract deployment successful</Typography>
                <Typography>Contract Address: {contractAddress}</Typography>
                <Typography>Transaction Hash: {tx}</Typography>
            </Paper>
        </Grid>}
    </Grid>
}

const page = () => <Dashboard content={<DeployCustomContractPage/>}/>
export default page