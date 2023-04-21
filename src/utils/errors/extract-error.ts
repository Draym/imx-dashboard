import {isNotEmpty, isNotNull, isObject} from "@d-lab/common-kit"

export function extractError(error: any): string {
    if (isNotNull(error)) {
        if (isObject(error)) {
            if (isNotEmpty(error.message)) {
                return error.message
            } else {
                return JSON.parse(error)
            }
        } else {
            return `${error}`
        }
    }
    return "unknown error"
}