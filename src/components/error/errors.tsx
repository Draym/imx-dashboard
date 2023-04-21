import React from "react"
import {Alert, AlertTitle, Stack} from "@mui/material"
import {HttpError} from "@/utils/errors/error"


export const ErrorHttp = {
    message: (props: { error: HttpError }) => {
        return <Stack alignItems="center">
            <Alert severity="error">
                {props.error.message} — <strong>{props.error.code}</strong>
            </Alert>
        </Stack>
    },
    withTitle: (props: { title?: string, error: HttpError }) => {
        return <Stack alignItems="center">
            <Alert severity="error">
                <AlertTitle>{props.title || "Error"}</AlertTitle>
                {props.error.message} — <strong>{props.error.code}</strong>
            </Alert>
        </Stack>
    }
}

export const Error = {
    message: (props: { error: string }) => {
        return <Stack alignItems="center">
            <Alert severity="error">
                {props.error}
            </Alert>
        </Stack>
    },
    withTitle: (props: { title?: string, error: string }) => {
        return <Stack alignItems="center">
            <Alert severity="error">
                <AlertTitle>{props.title || "Error"}</AlertTitle>
                {props.error}
            </Alert>
        </Stack>
    }
}