import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseQuery } from '@/redux/interfaces/baseQueryWithAuthorizationHeader'

type ProfileData = {
    id: string
    firstName: string
    lastName: string
    patronymic: string
    email: string
}

export const profileApi = createApi({
    reducerPath: 'profileApi',
    tagTypes: ['Profile'],
    baseQuery,
    endpoints: builder => ({
        getMyProfile: builder.query<ProfileData, void>({
            query: () => 'me',
            providesTags: (result) => [{type: 'Profile', id: result?.id}],
        }),
    }),
})

export const {
    useGetMyProfileQuery,
} = profileApi

export default profileApi.reducer