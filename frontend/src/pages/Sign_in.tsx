import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserSignInData } from '../types/auth'
import { useSignInMutation } from '../components/authMutations'

export const Sign_in = () => {
    const [formData, setFormData] = useState<UserSignInData>({
        username: '',
        password: '',
    })

    const registerMutation = useSignInMutation()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // Prevent page refresh
        registerMutation.mutate(formData)
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                {registerMutation.error && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {registerMutation.error?.message}
                    </div>
                )}
                <label>
                    user name:{' '}
                    <input
                        name="username"
                        onChange={handleInputChange}
                        placeholder="Sigma"
                        disabled={registerMutation.isPending}
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
                        disabled={registerMutation.isPending}
                        required
                    />
                </label>
                <br />

                <button type="submit" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? 'Signing in...' : 'Sign in'}
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
