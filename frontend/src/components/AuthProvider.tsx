import { useCookies } from 'react-cookie'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { getTokensMutation } from '../mutations/authMutations'
import { useAuthTokens } from '../hooks/useAuthTokens'
import { $api } from '../api'
import { AuthContext } from '../contexts/AuthContext'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authData, setAuthData] = useState({
        isAuthenticated: false,
        isLoading: true,
    })
    const [cookie, , removeCookie] = useCookies([
        'access_token',
        'refresh_token',
    ])
    const getTokens = getTokensMutation()
    const { saveAuthTokens } = useAuthTokens()

    const login = useCallback(() => {
        setAuthData({
            isAuthenticated: true,
            isLoading: false,
        })
    }, [])

    const logout = useCallback(() => {
        removeCookie('access_token', { path: '/' })
        removeCookie('refresh_token', { path: '/' })
        setAuthData({
            isAuthenticated: false,
            isLoading: false,
        })
    }, [])

    useEffect(() => {
        const fetchToken = async (refresh: string) => {
            try {
                const response = await getTokens.mutateAsync(refresh)
                saveAuthTokens(response.data.access, response.data.refresh)
                setAuthData({
                    isAuthenticated: true,
                    isLoading: false,
                })
            } catch (err) {
                console.error(err)
                setAuthData({
                    isAuthenticated: false,
                    isLoading: false,
                })
            }
        }

        if (cookie.refresh_token) {
            fetchToken(cookie.refresh_token)
        } else {
            setAuthData({
                isAuthenticated: false,
                isLoading: false,
            })
        }
    }, [])

    useLayoutEffect(() => {
        console.log(`ejected ${cookie.access_token}`)
        const authIntercept = $api.interceptors.request.use((config: any) => {
            config.headers.Authorization =
                !config._retry && cookie.access_token && !config.skipAuth
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
                console.log('error status', error.response.status)

                if (originalRequest._retry || originalRequest.skipAuth) {
                    return Promise.reject(error)
                }

                if (error.response.status === 401) {
                    try {
                        if (!cookie.refresh_token) {
                            removeCookie('access_token')
                            removeCookie('refresh_token')
                            setAuthData({
                                isAuthenticated: false,
                                isLoading: false,
                            })
                            return Promise.reject(error)
                        }

                        const response = await getTokens.mutateAsync(
                            cookie.refresh_token
                        )

                        saveAuthTokens(
                            response.data.access,
                            response.data.refresh
                        )
                        setAuthData({
                            isAuthenticated: true,
                            isLoading: false,
                        })

                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`
                        originalRequest._retry = true

                        return $api(originalRequest)
                    } catch (err) {
                        console.error(err)
                        removeCookie('access_token')
                        removeCookie('refresh_token')
                        setAuthData({
                            isAuthenticated: false,
                            isLoading: false,
                        })
                    }
                }
                return Promise.reject(error)
            }
        )
        return () => {
            $api.interceptors.response.eject(refresh_interseptor)
        }
    }, [cookie.refresh_token])

    return (
        <AuthContext.Provider value={{ ...authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    ) //<>{children}</>
}
