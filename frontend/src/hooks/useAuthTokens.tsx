import { useCookies } from 'react-cookie'

export const useAuthTokens = () => {
    const [, setCookie] = useCookies(['access_token', 'refresh_token'])

    const saveAuthTokens = (access: string, refresh: string) => {
        console
        setCookie('access_token', access, {
            path: '/',
            maxAge: 15 * 60, // 15 minutes
            sameSite: 'strict',
            secure: import.meta.env.PROD,
        })

        setCookie('refresh_token', refresh, {
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            sameSite: 'strict',
            secure: import.meta.env.PROD,
        })
    }
    return { saveAuthTokens }
}
