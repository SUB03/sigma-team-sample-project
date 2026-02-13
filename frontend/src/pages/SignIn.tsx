import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserSignInData } from '../types/authData'
import { useSignInMutation } from '../mutations/authMutations'
import { useAuthTokens } from '../hooks/useAuthTokens'
<<<<<<< HEAD
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
=======
import { useAuth } from '../contexts/AuthContext'
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd

export const SignIn = () => {
    const [formData, setFormData] = useState<UserSignInData>({
        username: '',
        password: '',
    })

    const authorizationMutation = useSignInMutation()
    const { saveAuthTokens } = useAuthTokens()
    const { login } = useAuth()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await authorizationMutation.mutateAsync(formData)
            login()
            saveAuthTokens(response.data.access, response.data.refresh)
        } catch (error) {
            console.error('Authorization failed:', error)
        }
    }

    return (
        <>
            <Header />
            <div className="min-vh-100 d-flex align-items-center py-5" style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
            }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-7">
                            <div className="card shadow-lg border-0" style={{
                                backdropFilter: 'blur(20px)',
                                background: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '20px'
                            }}>
                                <div className="card-body p-5">
                                    <div className="text-center mb-4">
                                        <div className="mb-3" style={{
                                            fontSize: '3rem'
                                        }}>🔐</div>
                                        <h1 className="h3 fw-bold mb-2" style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>Welcome Back!</h1>
                                        <p className="text-muted">Sign in to your account</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        {authorizationMutation.error && (
                                            <div className="alert alert-danger" role="alert">
                                                {authorizationMutation.error?.message}
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label fw-semibold">
                                                Username
                                            </label>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                className="form-control form-control-lg"
                                                onChange={handleInputChange}
                                                placeholder="Enter your username"
                                                disabled={authorizationMutation.isPending}
                                                required
                                                style={{
                                                    borderRadius: '12px',
                                                    border: '2px solid #e0e0e0',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="password" className="form-label fw-semibold">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                className="form-control form-control-lg"
                                                onChange={handleInputChange}
                                                placeholder="Enter your password"
                                                disabled={authorizationMutation.isPending}
                                                required
                                                style={{
                                                    borderRadius: '12px',
                                                    border: '2px solid #e0e0e0',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg w-100 mb-3 text-white"
                                            disabled={authorizationMutation.isPending}
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                                            }}
                                        >
                                            {authorizationMutation.isPending ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Signing in...
                                                </>
                                            ) : (
                                                'Sign In'
                                            )}
                                        </button>

                                        <div className="text-center">
                                            <p className="text-muted mb-0">
                                                Don't have an account?{' '}
                                                <Link to="/sign_up" className="fw-semibold" style={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                    textDecoration: 'none'
                                                }}>
                                                    Sign Up
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            
                            <div className="text-center mt-4">
                                <Link to="/" className="text-muted text-decoration-none">
                                    ← Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
