import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { UserSignUpData } from '../types/authData'
import { useSignUpMutation } from '../mutations/authMutations'
import { useAuthTokens } from '../hooks/useAuthTokens'

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
        <div>
            <div>
                <div>
                    <h1>Создайте аккаунт</h1>
                    <p>Присоединяйтесь к сообществу программистов</p>
                </div>

                {registerMutation.error && (
                    <div>
                        <div>⚠️</div>
                        <div>
                            <h3>Ошибка регистрации</h3>
                            <p>
                                {registerMutation.error?.message ||
                                    'Произошла ошибка при регистрации'}
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">
                            <span>👤</span>
                            Имя пользователя
                        </label>
                        <div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Sigma"
                                disabled={registerMutation.isPending}
                                required
                            />
                            <div>👤</div>
                        </div>
                        <div>Минимум 3 символа, только буквы и цифры</div>
                    </div>

                    <div>
                        <label htmlFor="email">
                            <span>📧</span>
                            Email адрес
                        </label>
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="sigma@gmail.com"
                                disabled={registerMutation.isPending}
                                required
                            />
                            <div>📧</div>
                        </div>
                        <div>Мы отправим подтверждение на этот адрес</div>
                    </div>

                    <div>
                        <label htmlFor="password">
                            <span>🔒</span>
                            Пароль
                        </label>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Не менее 8 символов"
                                disabled={registerMutation.isPending}
                                required
                            />
                            <div>🔒</div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>

                        {/* Индикатор силы пароля */}
                        {formData.password && (
                            <div>
                                <div>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} />
                                    ))}
                                </div>
                                <span>{passwordStrength.label}</span>
                            </div>
                        )}

                        <div>
                            <h4>Требования к паролю:</h4>
                            <ul>
                                <li>Минимум 8 символов</li>
                                <li>Строчные буквы</li>
                                <li>Заглавные буквы</li>
                                <li>Цифры</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword">
                            <span>🔐</span>
                            Подтверждение пароля
                        </label>
                        <div>
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
                            />
                            <div>🔐</div>
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {confirmPassword &&
                            formData.password !== confirmPassword && (
                                <div>Пароли не совпадают</div>
                            )}
                        {confirmPassword &&
                            formData.password === confirmPassword && (
                                <div>✓ Пароли совпадают</div>
                            )}
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) =>
                                    setTermsAccepted(e.target.checked)
                                }
                                disabled={registerMutation.isPending}
                            />
                            <span></span>
                            <span>
                                Я соглашаюсь с{' '}
                                <a href="/terms">условиями использования</a> и{' '}
                                <a href="/privacy">
                                    политикой конфиденциальности
                                </a>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={registerMutation.isPending || !termsAccepted}
                    >
                        {registerMutation.isPending ? (
                            <>
                                <span></span>
                                Регистрация...
                            </>
                        ) : (
                            'Создать аккаунт'
                        )}
                    </button>
                </form>

                <div>
                    <p>
                        Уже есть аккаунт? <Link to="/sign_in">Войти</Link>
                    </p>

                    <div>
                        <p>Или войти через:</p>
                        <div>
                            <button type="button">
                                <span>G</span>
                                Google
                            </button>
                            <button type="button">
                                <span>🐙</span>
                                GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
