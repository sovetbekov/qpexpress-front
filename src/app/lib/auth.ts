import { getServerSession, NextAuthOptions } from 'next-auth'
import Keycloak from 'next-auth/providers/keycloak'
import { AUTH_URL } from '@/globals'
import { JWT } from 'next-auth/jwt'

function parseJwt(token: string) {
    return token && JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

async function refreshAccessToken(token: JWT) {
    try {
        const url =
            `${AUTH_URL}/realms/QPExpress/protocol/openid-connect/token`
        const body = {
            client_id: process.env.KEYCLOAK_CLIENT_ID as string,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
        }

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: (Object.keys(body) as (keyof typeof body)[]).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key])).join('&'),
            method: 'POST',
        })
        const refreshedTokens = await response.json()
        if (!response.ok) {
            throw refreshedTokens
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        }
    } catch (error) {
        console.log(error)
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
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
        jwt: async ({token, account, user}) => {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    idToken: account.id_token,
                    accessTokenExpires: account.expires_at * 1000,
                    refreshToken: account.refresh_token,
                    refreshTokenExpires: parseJwt(account.refresh_token).exp * 1000,
                    user,
                }
            }
            if (Date.now() < token.accessTokenExpires) {
                return token
            }
            return await refreshAccessToken(token)
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
        redirect: async ({url, baseUrl}: {url: string, baseUrl: string}) => {
            return url.startsWith(baseUrl) ? url : baseUrl
        }
    },
}

export async function getServerAuthSession() {
    return await getServerSession(authOptions)
}