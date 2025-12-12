import React, { useState } from 'react'
import type { UserSignUpData } from '../types/auth'
import { useSignUpMutation } from '../components/authMutations'

export function Sign_up() {
    const [formData, setFormData] = useState<UserSignUpData>({
        username: '',
        email: '',
        password: '',
    })

    const registerMutation = useSignUpMutation()

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
                email_address:{' '}
                <input
                    name="email"
                    type="email"
                    onChange={handleInputChange}
                    placeholder="Sigma@gmail.com"
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
                {registerMutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    )
}
