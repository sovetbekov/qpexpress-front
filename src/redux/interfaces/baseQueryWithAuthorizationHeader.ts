import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { getSession } from 'next-auth/react'
import { BACKEND_URL } from '@/globals'

export const baseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/v1`,
    prepareHeaders: async (headers) => {
        const token = await getSession().then(session => session?.accessToken)
        // If we have a token set in state, let's assume that we should be passing it.
        if (token) {
            headers.set('Authorization', `Bearer ${ token }`)
        }

        return headers
    },
})

export default baseQuery