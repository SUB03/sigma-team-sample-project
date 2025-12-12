import { useMutation } from '@tanstack/react-query'
import type { UserSignUpData, UserSignInData } from '../types/auth'
import { base_url } from '../constants/api'

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: async (userData: UserSignUpData) => {
            const response = await fetch(`${base_url}/user/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            if (!response.ok) {
                throw new Error('Registration failed')
            }

            return await response.json()
        },
        onSuccess: (data) => {
            console.log('Registration successful:', data)
            // Handle successful registration (redirect, show message, etc.)
        },
        onError: (error: Error) => {
            console.error('Registration error:', error)
            // Handle error (show error message, etc.)
        },
    })
}

export const useSignInMutation = () => {
    return useMutation({
        mutationFn: async (userData: UserSignInData) => {
            const response = await fetch(`${base_url}/user/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            if (!response.ok) {
                throw new Error('authorization failed')
            }

            return await response.json()
        },
        onSuccess: (data) => {
            console.log('authorization successful:', data)
            // Handle successful registration (redirect, show message, etc.)
        },
        onError: (error: Error) => {
            console.error('authorization error:', error)
            // Handle error (show error message, etc.)
        },
    })
}
