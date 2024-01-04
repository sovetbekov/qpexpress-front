import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { BACKEND_URL } from '@/globals'

type CountryData = {
    id: string
    name: string
}

export async function getCountries(): Promise<CountryData[]> {
    const session = await getServerSession(authOptions)
    if (!BACKEND_URL) {
        return Promise.reject('API_URL is not defined')
    }
    if (!session) {
        return Promise.reject('Not authorized')
    }
    const response = await fetch(`${BACKEND_URL}/v1/countries`, {
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