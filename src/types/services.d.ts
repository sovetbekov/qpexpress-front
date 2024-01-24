export type Errors = {
    [key: string]: string[]
}

export type ServerActionResponse<T> = SuccessResponse<T> | ErrorResponse

export type SuccessResponse<T> = {
    status: 'success'
    data: T
}

export type ErrorResponse = {
    status: 'error'
    error: Errors
}