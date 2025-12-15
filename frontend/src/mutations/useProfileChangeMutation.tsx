import { useMutation } from '@tanstack/react-query'
import { base_url } from '../constants/api'
import type { UserProfileData } from '../types/userProfileData'
import { useCookies } from 'react-cookie'

export const useProfileChangeMutation = () => {
    const [cookie] = useCookies(['access_token'])

    return useMutation({
        mutationFn: async (userData: UserProfileData) => {
            const response = await fetch(`${base_url}/user/profile/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookie.access_token}`,
                },
                body: JSON.stringify(userData),
            })

            if (!response.ok) {
                throw new Error('profile update failed')
            }

            return await response.json()
        },
        onSuccess: (data) => {
            console.log('profile update successful:', data)
            // Handle successful registration (redirect, show message, etc.)
        },
        onError: (error: Error) => {
            console.error('profile update error:', error)
        },
    })
}
