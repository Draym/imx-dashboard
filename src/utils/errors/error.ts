export interface HttpError {
    message: string
    code: string
}

export function httpError(message: string, code = "0"): HttpError {
    return {message, code}
}