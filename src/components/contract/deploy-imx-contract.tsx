import NFT from "@/resources/blockchain/contracts/NFT.json"
import {useSigner} from "wagmi"
import {useEffect, useState} from "react"
import {isEmpty, isNotEmpty, isNotNull, isNull} from "@d-lab/common-kit"
import Network from "@/utils/enums/network.enum"
import {ethers} from "ethers"
import {Button, CircularProgress, Grid, Link, Paper, Stack, TextField, Typography} from "@mui/material"
import GitHubIcon from "@mui/icons-material/GitHub"
import {extractError} from "@/utils/errors/extract-error"
import {Error} from "@/components/error/errors"

export interface DeployImxContractProps {
    setContractAddress?: (contractAddress: string) => void
    setTx?: (tx: string) => void
}

export default function DeployImxContract(props: DeployImxContractProps) {
    const abi = JSON.stringify(NFT.abi)
    const bytecode = NFT.bytecode
    const {data: signer} = useSigner()
    const [contractName, setContractName] = useState("")
    const [contractSymbol, setContractSymbol] = useState("")
    const [contractMetadata, setContractMetadata] = useState("")
    const [contractAddress, setContractAddress] = useState("")
    const [tx, setTx] = useState("")
    const [imxOwner, setImxOwner] = useState("")
    const [error, setError] = useState<string | undefined>(undefined)
    const [submit, setSubmit] = useState(false)

    useEffect(() => {
        if (isNotNull(signer)) {
            signer!.getChainId().then(chainId => {
                setImxOwner((chainId === Network.MAINNET ? process.env.NEXT_PUBLIC_IMX_OWNER : process.env.NEXT_PUBLIC_IMX_SANDBOX_OWNER) || "")
            })
        }
    }, [signer])

    const isNotValid = (): boolean => {
        return isEmpty(abi) || isEmpty(bytecode) || isNull(signer) || isEmpty(contractName) || isEmpty(contractMetadata) || isEmpty(contractSymbol) || isEmpty(imxOwner)
    }

    const handleSubmit = async () => {
        try {
            setSubmit(true)
            const factory = new ethers.ContractFactory(abi, bytecode, signer!)
            const contract = await factory.deploy(contractName, contractSymbol, contractMetadata, imxOwner)
            setError(undefined)
            setContractAddress(contract.address)
            setTx(contract.deployTransaction.hash)
            console.log("transaction: ", contract.deployTransaction)
            props.setContractAddress?.(contract.address)
            props.setTx?.(contract.deployTransaction.hash)
        } catch (e) {
            setError(extractError(e))
        }
        setSubmit(false)
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
                <Stack direction="row" spacing={0.5}>
                    <Typography>IMX Contract is hosted on</Typography>
                    <Link href="https://github.com/Draym/imx-contract/blob/main/contracts/NFT.sol" target="_blank">GitHub<GitHubIcon/></Link>
                </Stack>
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
        {isEmpty(contractAddress) && <Grid item xs={12}>
            <Button
                fullWidth
                variant="outlined"
                color="success"
                onClick={handleSubmit}
                disabled={isNotValid() || submit}
                sx={{marginTop: "20px"}}
            >
                Start Deployment
                {submit && <CircularProgress color="inherit" size={20} sx={{marginLeft: "5px"}}/>}
            </Button>
        </Grid>
        }
        {isNotEmpty(contractAddress) && <Grid item xs={12}>
            <Paper elevation={1}>
                <Typography variant="h6" color="green">Contract deployment successful</Typography>
                <Typography>Contract Address: {contractAddress}</Typography>
                <Typography>Transaction Hash: {tx}</Typography>
            </Paper>
        </Grid>}
        {isNotEmpty(error) && <Error.message error={error!}/>}
    </Grid>
}