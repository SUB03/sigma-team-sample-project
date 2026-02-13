import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { UserSignUpData } from '../types/authData'
import { useSignUpMutation } from '../mutations/authMutations'
import { useAuthTokens } from '../hooks/useAuthTokens'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export function SignUp() {
    const { saveAuthTokens } = useAuthTokens()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<UserSignUpData>({
        username: '',
        email: '',
        password: '',
    })
    const [confirmPassword, setConfirmPassword] = useState('')
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])

    const registerMutation = useSignUpMutation()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const validateForm = () => {
        const errors: string[] = []

        if (!formData.username.trim()) {
            errors.push('Username is required')
        } else if (formData.username.length < 3) {
            errors.push('Username must be at least 3 characters')
        }

        if (!formData.email.trim()) {
            errors.push('Email is required')
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.push('Please enter a valid email')
        }

        if (!formData.password) {
            errors.push('Password is required')
        } else if (formData.password.length < 8) {
            errors.push('Password must be at least 8 characters')
        }

        if (formData.password !== confirmPassword) {
            errors.push('Passwords do not match')
        }

        if (!termsAccepted) {
            errors.push('You must accept the terms of service')
        }

        return errors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const errors = validateForm()
        setValidationErrors(errors)
        
        if (errors.length > 0) {
            return
        }

        try {
            const response = await registerMutation.mutateAsync(formData)
            saveAuthTokens(response.data.access, response.data.refresh)
            navigate('/user', { replace: true })
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    const getPasswordStrength = (password: string) => {
        if (!password) return { score: 0, label: '', color: 'secondary' }

        let score = 0
        if (password.length >= 8) score++
        if (/[a-z]/.test(password)) score++
        if (/[A-Z]/.test(password)) score++
        if (/\d/.test(password)) score++

        const levels = [
            { label: 'Weak', color: 'danger' },
            { label: 'Weak', color: 'danger' },
            { label: 'Medium', color: 'warning' },
            { label: 'Good', color: 'success' },
            { label: 'Excellent', color: 'success' },
        ]

        return { score, ...levels[Math.min(score, 4)] }
    }

    const passwordStrength = getPasswordStrength(formData.password)

    return (
        <>
            <Header />
            <div className="min-vh-100 d-flex align-items-center py-5" style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
            }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8">
                            <div className="card shadow-lg border-0" style={{
                                backdropFilter: 'blur(20px)',
                                background: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '20px'
                            }}>
                                <div className="card-body p-5">
                                    <div className="text-center mb-4">
                                        <div className="mb-3" style={{
                                            fontSize: '3rem'
                                        }}>🚀</div>
                                        <h1 className="h3 fw-bold mb-2" style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>Create Account</h1>
                                        <p className="text-muted">Join the programming community</p>
                                    </div>

                                    {(validationErrors.length > 0 || registerMutation.error) && (
                                        <div className="alert alert-danger" role="alert">
                                            <strong>⚠️ Errors:</strong>
                                            <ul className="mb-0 mt-2">
                                                {validationErrors.map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                                {registerMutation.error && (
                                                    <li>{registerMutation.error?.message}</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label fw-semibold">
                                                Username
                                            </label>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                className="form-control form-control-lg"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                placeholder="Sigma"
                                                disabled={registerMutation.isPending}
                                                required
                                                style={{
                                                    borderRadius: '12px',
                                                    border: '2px solid #e0e0e0',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                            <small className="text-muted">At least 3 characters</small>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label fw-semibold">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                className="form-control form-control-lg"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="sigma@gmail.com"
                                                disabled={registerMutation.isPending}
                                                required
                                                style={{
                                                    borderRadius: '12px',
                                                    border: '2px solid #e0e0e0',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label fw-semibold">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                className="form-control form-control-lg"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="At least 8 characters"
                                                disabled={registerMutation.isPending}
                                                required
                                                style={{
                                                    borderRadius: '12px',
                                                    border: '2px solid #e0e0e0',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                            
                                            {formData.password && (
                                                <div className="mt-2">
                                                    <div className="progress" style={{ height: '8px', borderRadius: '8px', overflow: 'hidden' }}>
                                                        <div 
                                                            className={`progress-bar bg-${passwordStrength.color}`}
                                                            style={{ 
                                                                width: `${(passwordStrength.score / 4) * 100}%`,
                                                                transition: 'width 0.3s ease'
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <small className={`text-${passwordStrength.color} fw-semibold`}>
                                                        {passwordStrength.label}
                                                    </small>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                                Confirm Password
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                className="form-control form-control-lg"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Repeat password"
                                                disabled={registerMutation.isPending}
                                                required
                                                style={{
                                                    borderRadius: '12px',
                                                    border: '2px solid #e0e0e0',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                            {confirmPassword && formData.password !== confirmPassword && (
                                                <small className="text-danger fw-semibold">❌ Passwords do not match</small>
                                            )}
                                            {confirmPassword && formData.password === confirmPassword && (
                                                <small className="text-success fw-semibold">✓ Passwords match</small>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="terms"
                                                    checked={termsAccepted}
                                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                                    disabled={registerMutation.isPending}
                                                />
                                                <label className="form-check-label" htmlFor="terms">
                                                    I agree to the terms of service
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg w-100 mb-3 text-white"
                                            disabled={registerMutation.isPending || !termsAccepted}
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                                            }}
                                        >
                                            {registerMutation.isPending ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Signing up...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </button>

                                        <div className="text-center">
                                            <p className="text-muted mb-0">
                                                Already have an account?{' '}
                                                <Link to="/sign_in" className="fw-semibold" style={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                    textDecoration: 'none'
                                                }}>
                                                    Sign In
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
