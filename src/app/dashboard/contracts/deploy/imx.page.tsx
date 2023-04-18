import Dashboard from "../../page"
import {useSigner} from "wagmi"
import GitHubIcon from '@mui/icons-material/GitHub';
import {Button, Grid, Link, Paper, TextField, Typography} from "@mui/material"
import {useEffect, useState} from "react"
import {isEmpty, isNotEmpty, isNotNull, isNull} from "@d-lab/common-kit"
import {ethers} from "ethers"
import NFT from "../../../../resources/blockchain/contracts/NFT.json"

function DeployImxContractPage() {
    const abi = JSON.stringify(NFT.abi)
    const bytecode = NFT.bytecode
    const {data: signer} = useSigner()
    const [contractName, setContractName] = useState("")
    const [contractSymbol, setContractSymbol] = useState("")
    const [contractMetadata, setContractMetadata] = useState("")
    const [contractAddress, setContractAddress] = useState("")
    const [tx, setTx] = useState("")
    const [imxOwner, setImxOwner] = useState("")

    useEffect(() => {
        if (isNotNull(signer)) {
            signer!.getChainId().then(chainId => {
                console.log("chainId: ", chainId)
                setImxOwner((chainId === 1 ? process.env.REACT_APP_IMX_OWNER : process.env.REACT_APP_IMX_SANDBOX_OWNER) || "")
            })
        }
    }, [signer])

    const isNotValid = (): boolean => {
        return isEmpty(abi) || isEmpty(bytecode) || isNull(signer) || isEmpty(contractName) || isEmpty(contractMetadata) || isEmpty(contractSymbol) || isEmpty(imxOwner)
    }

    const handleSubmit = async () => {
        const factory = new ethers.ContractFactory(abi, bytecode, signer!)
        const contract = await factory.deploy(contractName, contractSymbol, contractMetadata, imxOwner)
        setContractAddress(contract.address)
        setTx(contract.deployTransaction.hash)
        console.log("transaction: ", contract.deployTransaction)
    }

    return <Grid container>
        <Typography>Deploy an IMX collection contract</Typography>
        <Grid container sx={{marginTop: "10px"}}>
            <Typography>Contract Parameters:</Typography>
            <Grid item xs={12}>
                <TextField
                    margin="normal"
                    required
                    label="Contract Name"
                    name="name"
                    onChange={(e) => setContractName(e.target.value)}
                    value={contractName}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    margin="normal"
                    required
                    label="Contract Symbol"
                    name="symbol"
                    onChange={(e) => setContractSymbol(e.target.value)}
                    value={contractSymbol}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    margin="normal"
                    required
                    label="Metadata URL"
                    name="url"
                    onChange={(e) => setContractMetadata(e.target.value)}
                    value={contractMetadata}
                />
            </Grid>
        </Grid>
        <Grid container spacing={1} sx={{marginTop: "10px"}}>
            <Grid item xs={12}>
                <Typography>IMX Contract is hosted on <Link href="https://github.com/Draym/imx-contract/blob/main/contracts/NFT.sol" target="_blank">GitHub<GitHubIcon/></Link></Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography>Contract ABI:</Typography>
                <TextField
                    margin="normal"
                    label="abi"
                    name="ABI"
                    multiline
                    fullWidth
                    rows={5}
                    disabled={true}
                    value={abi}
                />
            </Grid>
            <Grid item xs={6}>
                <Typography>Contract Bytecode:</Typography>
                <TextField
                    margin="normal"
                    label="bytecode"
                    name="Bytecode"
                    multiline
                    fullWidth
                    rows={5}
                    disabled={true}
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

const page = () => <Dashboard content={<DeployImxContractPage/>}/>
export default page