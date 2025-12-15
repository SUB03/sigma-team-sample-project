import { useMutation } from '@tanstack/react-query'
import { $api } from '../api'
import type { UserProfileData } from '../types/userProfileData'

export const useProfileChangeMutation = () => {
    return useMutation({
        mutationFn: async (userData: UserProfileData) => {
            return await $api.put('user/profile/', userData)
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
