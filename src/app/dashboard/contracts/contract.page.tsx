import Dashboard from "../page"
import {useSigner} from "wagmi"
import {Button, Grid, TextField, Typography} from "@mui/material"
import {useState} from "react"
import {isEmpty, isNull} from "@d-lab/common-kit"
import {ethers} from "ethers"

function CollectionPage() {
    const { data: signer, isError, isLoading } = useSigner()
    const [abi, setAbi] = useState("")
    const [bytecode, setBytecode] = useState("")

    const isNotValid = (): boolean => {
        return isEmpty(abi) || isEmpty(bytecode) || isNull(signer)
    }

    const handleSubmit = async () => {
        const factory = new ethers.ContractFactory(abi, bytecode, signer!)
        console.log("address: ", await signer!.getAddress())
        // const contract = await factory.deploy(
        //     "0xd5e5a0d5ad5048af6e0f9479603eacbdbcf400ce",
        //     "https://metadata.dlab.ovh/api/metadata/ethereum/words-tell-art-craft/",
        //     "https://metadata.dlab.ovh/api/metadata/ethereum/words-tell-art-craft")
        // console.log(contract.address);
        // console.log(contract.deployTransaction);
    }

    return <Grid container>
        <Typography>Deploy a SmartContract</Typography>
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

const page =() => <Dashboard content={<CollectionPage/>}/>
export default page