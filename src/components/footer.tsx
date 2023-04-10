import {Box, Container, Stack, Typography} from "@mui/material"
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FacebookIcon from '@mui/icons-material/Facebook'

export default function Footer() {
    return (
        <footer className="fixed bottom-0 w-full" style={{borderTop: "0.1rem solid #DCDEDD"}}>
            <Container>
                <Stack direction="row" justifyContent="space-between" alignItems="center" height="50px">
                    <Typography>© DraymLab, 2023 </Typography>
                    <Box>
                        <FacebookIcon/>
                        <LinkedInIcon/>
                        <TwitterIcon/>
                        <YouTubeIcon/>
                    </Box>
                </Stack>
            </Container>
        </footer>
    )
}
