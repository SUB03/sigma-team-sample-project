import { useMutation } from '@tanstack/react-query'
import { useCookies } from 'react-cookie'
import { base_url } from '../api'

export const useLogout = () => {
    const [cookie] = useCookies(['access_token', 'refresh_token'])
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
                throw new Error('logout failed')
            }

            return response.status
        },
        onSuccess: (data) => {
            console.log('logout successful:', data)
            // Handle successful registration (redirect, show message, etc.)
        },
        onError: (error: Error) => {
            console.error('logout error:', error)
            // Handle error (show error message, etc.)
        },
    })
}
