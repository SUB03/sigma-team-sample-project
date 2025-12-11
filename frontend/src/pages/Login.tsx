import React, { useState } from 'react'
import Button from '../components/Button'

export function Login() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('http://localhost:8001/user/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add other headers if needed (e.g., Authorization)
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('Success:', data)
            // Handle successful response (e.g., save token, redirect)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <label>
                user name: <input name="myInput" onChange={handleUsername} />
            </label>
            <label>
                email_address: <input name="myInput" onChange={handleEmail} />
            </label>
            <label>
                password: <input name="myInput" onChange={handlePassword} />
            </label>

            <Button onClick={() => handleSubmit}>Login</Button>
        </>
    )
}
