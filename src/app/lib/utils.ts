import { ErrorResponse, ServerActionResponse, SuccessResponse } from '@/types'

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return !(value === null || value === undefined);
}

export function capitalize(s: string): string {
    return s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export function isError<T>(value: ServerActionResponse<T>): value is ErrorResponse {
    return value.status === 'error';
}

export function isSuccess<T>(value: ServerActionResponse<T>): value is SuccessResponse<T> {
    return value.status === 'success';
}