import { BACKEND_URL } from '@/globals'

type UserData = {
    firstName: string
    lastName: string
    patronymic: string
    email: string
    password: string
}

export async function createAccount(data: UserData, group?: string) {
    const response = await fetch(`${BACKEND_URL}/v1/users`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            ...data,
            group: group ? `/${group}` : '/User'
        }),
    })
    if (!response.ok) {
        return Promise.reject("Server error")
    }
    if (response.ok) {
        return true
    }
}