import React from 'react'
import { getUsers } from '@/services/account'
import UsersTable from '@/app/[language]/admin/users/UsersTable'
import { isError } from '@/app/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Layout() {
    const usersResponse = await getUsers()
    if (isError(usersResponse)) {
        return <div>Ошибка</div>
    }
    const users = usersResponse.data

    return (
        <div>
            <UsersTable users={users}/>
        </div>
    )
}