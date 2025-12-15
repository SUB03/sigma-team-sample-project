import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserSignInData } from '../types/auth'
import { useSignInMutation } from '../mutations/authMutations'
import { useAuthTokens } from '../hooks/useAuthTokens'

export const SignIn = () => {
    const [formData, setFormData] = useState<UserSignInData>({
        username: '',
        password: '',
    })

    const authorizationMutation = useSignInMutation()
    const { saveAuthTokens } = useAuthTokens()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // Prevent page refresh

        try {
            const response = await authorizationMutation.mutateAsync(formData)
            console.log(response)
            saveAuthTokens(response.data.access, response.data.refresh)
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                {authorizationMutation.error && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {authorizationMutation.error?.message}
                    </div>
                )}
                <label>
                    user name:{' '}
                    <input
                        name="username"
                        onChange={handleInputChange}
                        placeholder="Sigma"
                        disabled={authorizationMutation.isPending}
                        required
                    />
                </label>
                <br />

                <label>
                    password:{' '}
                    <input
                        name="password"
                        type="password"
                        onChange={handleInputChange}
                        placeholder="12345678"
                        disabled={authorizationMutation.isPending}
                        required
                    />
                </label>
                <br />

                <button
                    type="submit"
                    disabled={authorizationMutation.isPending}
                >
                    {authorizationMutation.isPending
                        ? 'Signing in...'
                        : 'Sign in'}
                </button>
                <Link to="/sign_up">
                    <button onClick={() => console.log('clicked')}>
                        register
                    </button>
                </Link>
            </form>
        </>
    )
}
