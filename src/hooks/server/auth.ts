import { getServerSession, Session } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { notEmpty } from '@/app/lib/utils'

type Roles = {[key: string]: string}

const roleNames: Roles = {
    user: 'Пользователь',
    admin: 'Администратор',
}

type AuthResult = {
    session: Session,
    roles?: string[],
    status: 'authenticated'
} | {
    status: 'unauthenticated'
}

export default async function useAuthorization(): Promise<AuthResult> {
    const session = await getServerSession(authOptions)
    if (session === null) {
        return { status: 'unauthenticated' }
    }
    const roles = session?.roles.map(role => {
        if (role in roleNames) {
            return roleNames[role]
        }
    }).filter(notEmpty)
    return { roles, session, status: 'authenticated' }
}