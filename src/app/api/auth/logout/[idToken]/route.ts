import { Response } from 'next/dist/compiled/@edge-runtime/primitives'
import { redirect } from 'next/navigation'
import { AUTH_URL, FRONTEND_URL } from '@/globals'

type Params = {
    params: {
        idToken: string
    }
}

export async function GET(request: Request, {params}: Params): Promise<Response> {
    if (FRONTEND_URL) {
        redirect(`${AUTH_URL}/realms/QPExpress/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURI(FRONTEND_URL)}&id_token_hint=${params.idToken}`)
    } else {
        return new Response("FRONTEND_URL is not defined", {status: 500})
    }
}