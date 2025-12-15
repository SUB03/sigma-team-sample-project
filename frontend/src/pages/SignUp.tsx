import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { UserSignUpData } from '../types/auth'
import { useSignUpMutation } from '../mutations/authMutations'
import { useAuthTokens } from '../hooks/useAuthTokens'
import '../csss/SignUp.css'

export function SignUp() {
    const { saveAuthTokens } = useAuthTokens()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<UserSignUpData>({
        username: '',
        email: '',
        password: '',
    })
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)

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
            errors.push('Имя пользователя обязательно')
        } else if (formData.username.length < 3) {
            errors.push('Имя должно содержать минимум 3 символа')
        }

        if (!formData.email.trim()) {
            errors.push('Email обязателен')
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.push('Введите корректный email')
        }

        if (!formData.password) {
            errors.push('Пароль обязателен')
        } else if (formData.password.length < 8) {
            errors.push('Пароль должен содержать минимум 8 символов')
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.push(
                'Пароль должен содержать заглавные и строчные буквы, цифры'
            )
        }

        if (formData.password !== confirmPassword) {
            errors.push('Пароли не совпадают')
        }

        if (!termsAccepted) {
            errors.push('Необходимо принять условия использования')
        }

        return errors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            alert(validationErrors.join('\n'))
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
        if (!password) return { score: 0, label: '', color: '#e0e0e0' }

        let score = 0
        if (password.length >= 8) score++
        if (/[a-z]/.test(password)) score++
        if (/[A-Z]/.test(password)) score++
        if (/\d/.test(password)) score++
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

        const levels = [
            { label: 'Очень слабый', color: '#ff4444' },
            { label: 'Слабый', color: '#ffa726' },
            { label: 'Средний', color: '#ffcc00' },
            { label: 'Хороший', color: '#4caf50' },
            { label: 'Отличный', color: '#2e7d32' },
        ]

        return {
            score,
            ...levels[Math.min(score, 4)],
        }
    }

    const passwordStrength = getPasswordStrength(formData.password)

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1 className="signup-title">Создайте аккаунт</h1>
                    <p className="signup-subtitle">
                        Присоединяйтесь к сообществу программистов
                    </p>
                </div>

                {registerMutation.error && (
                    <div className="error-message">
                        <div className="error-icon">⚠️</div>
                        <div className="error-content">
                            <h3>Ошибка регистрации</h3>
                            <p>
                                {registerMutation.error?.message ||
                                    'Произошла ошибка при регистрации'}
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            <span className="label-icon">👤</span>
                            Имя пользователя
                        </label>
                        <div className="input-container">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Sigma"
                                disabled={registerMutation.isPending}
                                required
                                className="form-input"
                            />
                            <div className="input-icon">👤</div>
                        </div>
                        <div className="input-hint">
                            Минимум 3 символа, только буквы и цифры
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            <span className="label-icon">📧</span>
                            Email адрес
                        </label>
                        <div className="input-container">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="sigma@gmail.com"
                                disabled={registerMutation.isPending}
                                required
                                className="form-input"
                            />
                            <div className="input-icon">📧</div>
                        </div>
                        <div className="input-hint">
                            Мы отправим подтверждение на этот адрес
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            <span className="label-icon">🔒</span>
                            Пароль
                        </label>
                        <div className="input-container">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Не менее 8 символов"
                                disabled={registerMutation.isPending}
                                required
                                className="form-input"
                            />
                            <div className="input-icon">🔒</div>
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>

                        {/* Индикатор силы пароля */}
                        {formData.password && (
                            <div className="password-strength">
                                <div className="strength-bars">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className={`strength-bar ${
                                                i <= passwordStrength.score
                                                    ? 'active'
                                                    : ''
                                            }`}
                                            style={{
                                                backgroundColor:
                                                    i <= passwordStrength.score
                                                        ? passwordStrength.color
                                                        : '#e0e0e0',
                                            }}
                                        />
                                    ))}
                                </div>
                                <span
                                    className="strength-label"
                                    style={{ color: passwordStrength.color }}
                                >
                                    {passwordStrength.label}
                                </span>
                            </div>
                        )}

                        <div className="password-requirements">
                            <h4>Требования к паролю:</h4>
                            <ul>
                                <li
                                    className={
                                        formData.password.length >= 8
                                            ? 'met'
                                            : ''
                                    }
                                >
                                    Минимум 8 символов
                                </li>
                                <li
                                    className={
                                        /[a-z]/.test(formData.password)
                                            ? 'met'
                                            : ''
                                    }
                                >
                                    Строчные буквы
                                </li>
                                <li
                                    className={
                                        /[A-Z]/.test(formData.password)
                                            ? 'met'
                                            : ''
                                    }
                                >
                                    Заглавные буквы
                                </li>
                                <li
                                    className={
                                        /\d/.test(formData.password)
                                            ? 'met'
                                            : ''
                                    }
                                >
                                    Цифры
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            <span className="label-icon">🔐</span>
                            Подтверждение пароля
                        </label>
                        <div className="input-container">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Повторите пароль"
                                disabled={registerMutation.isPending}
                                required
                                className={`form-input ${
                                    confirmPassword &&
                                    formData.password !== confirmPassword
                                        ? 'error'
                                        : confirmPassword &&
                                          formData.password === confirmPassword
                                        ? 'success'
                                        : ''
                                }`}
                            />
                            <div className="input-icon">🔐</div>
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {confirmPassword &&
                            formData.password !== confirmPassword && (
                                <div className="error-text">
                                    Пароли не совпадают
                                </div>
                            )}
                        {confirmPassword &&
                            formData.password === confirmPassword && (
                                <div className="success-text">
                                    ✓ Пароли совпадают
                                </div>
                            )}
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) =>
                                    setTermsAccepted(e.target.checked)
                                }
                                disabled={registerMutation.isPending}
                                className="checkbox-input"
                            />
                            <span className="custom-checkbox"></span>
                            <span className="checkbox-text">
                                Я соглашаюсь с{' '}
                                <a href="/terms" className="terms-link">
                                    условиями использования
                                </a>{' '}
                                и{' '}
                                <a href="/privacy" className="terms-link">
                                    политикой конфиденциальности
                                </a>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={registerMutation.isPending || !termsAccepted}
                        className={`submit-button ${
                            registerMutation.isPending ? 'loading' : ''
                        }`}
                    >
                        {registerMutation.isPending ? (
                            <>
                                <span className="spinner"></span>
                                Регистрация...
                            </>
                        ) : (
                            'Создать аккаунт'
                        )}
                    </button>
                </form>

                <div className="signup-footer">
                    <p className="login-link">
                        Уже есть аккаунт?{' '}
                        <Link to="/sign_in" className="login-link-text">
                            Войти
                        </Link>
                    </p>

                    <div className="social-signup">
                        <p className="social-title">Или войти через:</p>
                        <div className="social-buttons">
                            <button
                                type="button"
                                className="social-button google"
                            >
                                <span className="social-icon">G</span>
                                Google
                            </button>
                            <button
                                type="button"
                                className="social-button github"
                            >
                                <span className="social-icon">🐙</span>
                                GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
