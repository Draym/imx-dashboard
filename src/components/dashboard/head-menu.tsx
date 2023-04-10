import * as React from 'react';
import {alpha, styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {Button} from "@mui/material"
import Path from "../../routes/path.enum"
import {Logo} from "../../resources"
import {useNavigate} from "react-router"

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

// <Box>
//     <Search sx={{border: '1px solid black'}}>
//         <SearchIconWrapper>
//             <SearchIcon/>
//         </SearchIconWrapper>
//         <StyledInputBase
//             placeholder="Search…"
//             inputProps={{'aria-label': 'search'}}
//         />
//     </Search>
// </Box>
export default function HeadMenu() {
    const navigate = useNavigate()

    return (
        <Box sx={{flexGrow: 1}}>
            <Toolbar>
                <Box sx={{width: '228px'}}>
                    <Button variant="text" onClick={() => navigate(Path.HOME)}>
                        <img className="w-8 h-auto mr-1" src={Logo} alt="logo"/>
                        <span className="text-xl">IMX Dashboard</span>
                    </Button>
                </Box>
                <Box sx={{flexGrow: "1"}}/>
                <Box>
                    <IconButton
                        size="large"
                        aria-label="show new notifications"
                        color="inherit"
                    >
                        <Badge badgeContent={0} color="error">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </Box>
    )
}