import { useMutation } from '@tanstack/react-query'
import { useCookies } from 'react-cookie'
import { $api, base_url } from '../api'

export const useLogoutMutation = () => {
    const [cookie] = useCookies(['access_token', 'refresh_token'])
    return useMutation({
        mutationFn: async () => {
            return await $api.post(`${base_url}/user/logout/`, {
                refresh: cookie.refresh_token,
            })
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
