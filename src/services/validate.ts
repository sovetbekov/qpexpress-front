import _ from 'lodash'
import { Errors } from '@/types'

export function nonEmptyValidator(value: string): boolean {
    return !_.isEmpty(value)
}

export function patternValidator(value: string, pattern: RegExp): boolean {
    return pattern.test(value)
}

export function emailValidator(value: string): boolean {
    return patternValidator(value, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i)
}

export function phoneValidator(value: string): boolean {
    return patternValidator(value, /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/i)
}

export function iinValidator(value: string): boolean {
    return patternValidator(value, /^\d{12}$/i)
}

export function isFileEmpty(file: File | null): boolean {
    return !file || file.size === 0;
}

export function fileValidator(data: FormData, fieldName: string): boolean {
    const file = data.get(fieldName)
    const fileId = data.get(`${fieldName}Id`)
    if (fileId) {
        return true
    }
    if (!file) {
        return false
    }
    if (file instanceof File) {
        if (isFileEmpty(file)) {
            return false
        }
    }
    return true;
}