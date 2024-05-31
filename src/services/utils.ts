'use server'

import { getServerSession, Session } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { BACKEND_URL } from '@/globals'
import { ErrorResponse, Errors, ServerActionResponse, SuccessResponse } from '@/types/services'
import { ValidatorProps } from '@/types'
import { isError } from '@/app/lib/utils'

type MakeRequestOptions = {
    requestOptions?: RequestInit,
    validateRequest?: () => Errors,
    postRequest?: () => void,
    authRequired?: boolean,
    validators?: Record<string, ValidatorProps[]>,
}

export async function makeRequestNoAuth<T>(url: string, options?: MakeRequestOptions): Promise<ServerActionResponse<T>> {
    const errors = options?.validateRequest?.() ?? {};
    if (options?.validators) {
        Object.entries(options.validators).forEach(([key, validators]) => {
            validators.forEach(validator => {
                if (!validator.validate) {
                    errors[key] = [...(errors[key] ?? []), validator.message];
                }
            });
        });
    }

    if (Object.keys(errors).length > 0) {
        console.error(errors);
        return {
            status: 'error',
            error: errors,
        };
    }


    const backendUrl = await getBackendUrl();
    if (isError(backendUrl)) {
        return backendUrl;
    }
    const response = await fetch(`${backendUrl.data}/${url}`, {
        ...options?.requestOptions,
        headers: {
            ...options?.requestOptions?.headers,
        },
    });

    if (!response.ok) {
        const errorResponse: ErrorResponse = {
            status: 'error',
            error: {
                serverError: [`Failed to fetch: ${response.status}`],
            },
        };
        console.log(url, errorResponse);
        return errorResponse;
    } else {
        options?.postRequest?.();
        return {
            status: 'success',
            data: await response.json() as T,
        };
    }
}

type SessionAndBackendUrl = {
    session: Session | null
    backendUrl: string
}

export async function getSession(): Promise<ServerActionResponse<Session>> {
    const session = await getServerSession(authOptions)
    if (!session) {
        return {
            status: 'error',
            error: {
                serverError: ['Not authorized']
            },
        }
    }
    return {
        status: 'success',
        data: session,
    }
}

export async function getBackendUrl(): Promise<ServerActionResponse<string>> {
    if (!BACKEND_URL) {
        return {
            status: 'error',
            error: {
                serverError: ['API_URL is not defined']
            },
        }
    }
    return {
        status: 'success',
        data: BACKEND_URL,
    }
}

export async function getSessionAndBackendUrl(authRequired?: boolean): Promise<ServerActionResponse<SessionAndBackendUrl>> {
    function getSessionIfRequired() {
        if (authRequired === true || authRequired === undefined) {
            return getSession()
        }
        return {
            status: 'success',
            data: null,
        } as SuccessResponse<null>
    }
    const session = await getSessionIfRequired()
    if (isError(session)) {
        return session
    }
    const backendUrl = await getBackendUrl()
    if (isError(backendUrl)) {
        return backendUrl
    }
    return {
        status: 'success',
        data: {
            session: session.data,
            backendUrl: backendUrl.data,
        },
    }
}

export async function makeRequest<T>(url: string, options?: MakeRequestOptions): Promise<ServerActionResponse<T>> {
    const errors = options?.validateRequest?.() ?? {}
    if (options?.validators) {
        Object.entries(options.validators).forEach(([key, validators]) => {
            validators.forEach(validator => {
                if (!validator.validate) {
                    errors[key] = [...errors[key] ?? [], validator.message]
                }
            })
        })
    }
    if (errors && Object.keys(errors).length > 0) {
        console.error(errors)
        return {
            status: 'error',
            error: errors,
        }
    }
    const sessionAndBackendUrlResponse = await getSessionAndBackendUrl(options?.authRequired)
    if (isError(sessionAndBackendUrlResponse)) {
        return sessionAndBackendUrlResponse
    }
    const { session, backendUrl } = sessionAndBackendUrlResponse.data
    const response = await fetch(`${backendUrl}/${url}`, {
        ...options?.requestOptions,
        headers: {
            ...options?.requestOptions?.headers,
            'Authorization': session ? `Bearer ${session.accessToken}` : '',
        },
    })
    if (!response.ok) {
        const errorResponse = {
            status: 'error',
            error: {
                serverError: [`Failed to fetch: ${response.status}`]
            },
        } as ErrorResponse
        console.log(url, errorResponse)
        return errorResponse
    } else {
        options?.postRequest?.()
        return {
            status: 'success',
            data: await response.json() as T,
        }
    }
}

export async function getLanguageBundle(language: string, ns: string): Promise<any> {
    return await import(`@/app/i18n/locales/${language}/${ns}.json`, {
        assert: {
            type: 'json'
        }
    })
}

export async function createQueryParams(params: Record<string, string | number | boolean | undefined>): Promise<string> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            queryParams.append(key, value.toString())
        }
    })
    return queryParams.toString()
}