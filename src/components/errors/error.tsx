import {HttpError} from "@d-lab/common-kit"
import React from "react"
import {Alert, AlertTitle, Stack} from "@mui/material"

export function FatError(props: { error: HttpError }) {
    return <Stack alignItems="center">
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {props.error.message} — <strong>{props.error.code}</strong>
        </Alert>
    </Stack>
}

export function TinyError(props: { error: HttpError }) {
    return <Stack alignItems="center">
        <Alert severity="error">
            {props.error.message} — <strong>{props.error.code}</strong>
        </Alert>
    </Stack>
}