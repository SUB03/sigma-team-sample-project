import { useMutation } from '@tanstack/react-query'
import type {
    UserSignUpData,
    UserSignInData,
    AuthResponse,
} from '../types/auth'
import { $api } from '../api'
import type { AxiosError, AxiosResponse } from 'axios'

export const useSignUpMutation = () => {
    return useMutation<AxiosResponse<AuthResponse>, AxiosError, UserSignUpData>(
        {
            mutationFn: async (userData: UserSignUpData) => {
                return $api.post<AuthResponse>('/user/register/', userData)
            },
            onSuccess: (data) => {
                console.log('Registration successful:', data)
                // Handle successful registration (redirect, show message, etc.)
            },
            onError: (error: Error) => {
                console.error('Registration error:', error)
                // Handle error (show error message, etc.)
            },
        }
    )
}

export const useSignInMutation = () => {
    return useMutation({
        mutationFn: async (userData: UserSignInData) => {
            return $api.post('/user/login/', userData)
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

export const getTokensMutation = () => {
    return useMutation({
        mutationFn: async (refresh: string) => {
            return $api.post('/user/token/refresh/', { refresh: refresh })
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
