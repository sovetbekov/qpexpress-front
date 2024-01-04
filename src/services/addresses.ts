import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { BACKEND_URL } from '@/globals'

type Address = {
    id: string
    country: string
    city: string
    district: string
    neighborhood: string
    street: string
    house: string
    postcode: string
}

export async function getAddresses(): Promise<Address[]> {
    const session = await getServerSession(authOptions)
    if (!BACKEND_URL) {
        return Promise.reject('API_URL is not defined')
    }
    if (!session) {
        return Promise.reject('Not authorized')
    }
    const response = await fetch(`${BACKEND_URL}/v1/addresses`, {
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
    })
    if (!response.ok) {
        return Promise.reject(`Failed to fetch: ${response.status}`)
    }
    try {
        return await response.json()
    } catch (e) {
        return Promise.reject(e)
    }
}