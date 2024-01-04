export type ValidationError = {
    fields: string[]
    message: string
    type: 'error' | 'warning'
}