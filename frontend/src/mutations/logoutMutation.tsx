import { useMutation } from '@tanstack/react-query'
import { base_url } from '../constants/api'
import { useCookies } from 'react-cookie'

export const useLogout = () => {
    const [cookie, , removeCookie] = useCookies([
        'access_token',
        'refresh_token',
    ])
    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`${base_url}/user/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookie.access_token}`,
                },
                body: JSON.stringify({ refresh: cookie.refresh_token }),
            })

            if (!response.ok) {
                console.log('hmmm....')
                console.log(response)
                throw new Error('logout failed')
            }

            return await response.json()
        },
        onSuccess: (data) => {
            console.log('logout successful:', data)
            removeCookie('access_token', { path: '/' })
            removeCookie('refresh_token', { path: '/' })
            // Handle successful registration (redirect, show message, etc.)
        },
        onError: (error: Error) => {
            console.error('logout error:', error)
            // Handle error (show error message, etc.)
        },
    })
}
