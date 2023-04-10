import {Suspense} from "react"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import routes from "./routes/routes"
import {Box, CircularProgress} from "@mui/material"
export default function App() {
    function loading() {
        return <Box alignItems="center" justifyContent="center" display="flex" width="100%" height="100%">
            <CircularProgress />
        </Box>
    }

    return <div className="App">
        <BrowserRouter>
            <Suspense fallback={loading()}>
                <Routes>
                    {routes.map((route, idx) => {
                        return route.component ? (
                            <Route
                                key={idx}
                                path={route.path}
                                element={
                                    (route.restrictedBy == null || route.restrictedBy.validate() ?
                                        <route.component/> :
                                        <Navigate to={{pathname: route.restrictedBy.redirectOnFailure}} replace/>)
                                }/>
                        ) : null
                    })}
                    <Route path="*" element={<Navigate to="/404" replace/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    </div>
}