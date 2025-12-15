import { useCookies } from 'react-cookie'
import { useEffect, useLayoutEffect } from 'react'
import { getTokensMutation } from '../mutations/authMutations'
import { useAuthTokens } from '../hooks/useAuthTokens'
import { $api } from '../api'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [cookie, , removeCookie] = useCookies([
        'access_token',
        'refresh_token',
    ])

    const getTokens = getTokensMutation()
    const { saveAuthTokens } = useAuthTokens()

    useEffect(() => {
        const fetchToken = async (refresh: string) => {
            try {
                const response = await getTokens.mutateAsync(refresh)
                saveAuthTokens(response.data.access, response.data.refresh)
            } catch {
                removeCookie('access_token')
                removeCookie('refresh_token')
            }
        }

        if (cookie.refresh_token) {
            fetchToken(cookie.refresh_token)
        } else {
        }
    }, [])

    useLayoutEffect(() => {
        console.log(`ejected ${cookie.access_token}`)
        const authIntercept = $api.interceptors.request.use((config: any) => {
            config.headers.Authorization =
                !config._retry && cookie.access_token
                    ? `Bearer ${cookie.access_token}`
                    : config.headers.Authorization
            return config
        })

        return () => {
            $api.interceptors.request.eject(authIntercept)
        }
    }, [cookie.access_token])

    useLayoutEffect(() => {
        const refresh_interseptor = $api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config
                if (error.response.status === 403) {
                    try {
                        const response = await getTokens.mutateAsync(
                            cookie.refresh_token
                        )
                        saveAuthTokens(
                            response.data.access,
                            response.data.refresh
                        )

                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`
                        originalRequest._retry = true

                        return $api(originalRequest)
                    } catch {
                        removeCookie('access_token')
                        removeCookie('refresh_token')
                    }
                }
                return Promise.reject(error)
            }
        )
        return () => {
            $api.interceptors.response.eject(refresh_interseptor)
        }
    }, [])

    return <>{children}</>
    //             <AuthContext.Provider>{children}</AuthContext.Provider>
}
