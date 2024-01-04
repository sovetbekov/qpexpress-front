// noinspection ES6UnusedImports,JSUnusedGlobalSymbols
import NextAuth from 'next-auth'

declare module 'next-auth' {
    interface Session {
        accessToken: string
        accessTokenExpires: number
        refreshToken: string
        refreshTokenExpires: number
        error?: string
        idToken: string
        roles: string[]
        user: User
    }

    interface User {
        id?: string
        accessToken: string
        accessTokenExpires: number
        refreshToken: string
        refreshTokenExpires: number
    }

    interface Account {
        access_token: string
        expires_at: number
        refresh_expires_in: number
        refresh_token: string
        id_token: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        refreshTokenExpires: number
        accessTokenExpires: number
        idToken: string
        refreshToken: string
        accessToken: string
        error: string
        sub: string
        exp: number
        iat: number
        jti: string
    }
}