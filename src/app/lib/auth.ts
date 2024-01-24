import { getServerSession, NextAuthOptions } from 'next-auth'
import Keycloak from 'next-auth/providers/keycloak'
import { AUTH_URL } from '@/globals'

function parseJwt(token: string) {
    return token && JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

async function refreshAccessToken(refreshToken: string) {
    const url =
        `${AUTH_URL}/realms/QPExpress/protocol/openid-connect/token`
    const body = {
        client_id: process.env.KEYCLOAK_CLIENT_ID as string,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    }

    return await fetch(url, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: (Object.keys(body) as (keyof typeof body)[]).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&'),
        method: 'POST',
    })
}


export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Keycloak({
            clientId: process.env.KEYCLOAK_CLIENT_ID as string,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
            issuer: `${AUTH_URL}/realms/QPExpress`,
            checks: ['pkce'],
        }),
    ],
    callbacks: {
        jwt: async ({token, account}) => {
            if (account?.expires_at) {
                return {
                    ...token,
                    error: '',
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    idToken: account.id_token,
                    accessTokenExpires: account.expires_at,
                    refreshTokenExpires: Date.now() + account.refresh_expires_in,
                }
            } else if (token?.refreshTokenExpires && token.refreshToken && Date.now() > token.refreshTokenExpires) {
                try {
                    const response = await refreshAccessToken(token.refreshToken)
                    const tokens = await response.json()
                    if (!response.ok) {
                        throw tokens
                    }
                    return {
                        ...token,
                        error: '',
                        accessToken: tokens.access_token,
                        accessTokenExpires: Date.now() + tokens.expires_in,
                        refreshToken: tokens.refresh_token,
                        refreshTokenExpires: Date.now() + tokens.refresh_expires_in,
                    }
                } catch (error) {
                    console.log(`refresh_token error: ${JSON.stringify(error)}`)
                    return {
                        ...token,
                        error: 'RefreshAccessTokenError',
                    }
                }
            } else if (token?.accessTokenExpires && Date.now() > token.accessTokenExpires) {
                return token
            } else {
                return {
                    ...token,
                    error: 'RefreshAccessTokenError',
                }
            }
        },
        session: async ({session, token}) => {
            if (token) {
                session.accessToken = token.accessToken
                session.refreshToken = token.refreshToken
                session.idToken = token.idToken
                session.roles = parseJwt(token.accessToken as any).realm_access.roles
                session.accessTokenExpires = token.accessTokenExpires ?? 0
                session.refreshTokenExpires = token.refreshTokenExpires ?? 0
                session.error = token.error
                session.user.id = token.sub
            }
            return session
        },
    },
}

export async function getServerAuthSession() {
    return await getServerSession(authOptions)
}