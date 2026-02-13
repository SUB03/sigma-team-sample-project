import { z } from 'zod'
import { getProfileQuery } from '../hooks/useProfileQuery'
import { useProfileChangeMutation } from '../mutations/useProfileChangeMutation'
import { useQueryClient } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const userSchema = z.object({
    username: z.string().optional(),
    email: z.email().optional(),
    password: z.string().optional(),
    age: z
        .string()
        .transform((val) => (val === '' ? undefined : parseInt(val, 10)))
        .pipe(z.number().int().positive().optional()),
    photo: z.string().optional(),
    description: z.string().optional(),
    sex: z.string().optional(),
})

export function UserSettings() {
    const response = getProfileQuery()
    const profileChangeMutation = useProfileChangeMutation()
    const queryClient = useQueryClient()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    async function FormAction(form_data: FormData) {
        setSuccessMessage(null)
        const formValues = userSchema.safeParse(Object.fromEntries(form_data))

        if (formValues.success) {
            console.log(formValues.data)

            // filter data
            const filteredData = Object.fromEntries(
                Object.entries(formValues.data).filter(
                    ([_, value]) => value !== '' && value !== undefined
                )
            )

            try {
                await profileChangeMutation.mutateAsync(filteredData)
                await queryClient.invalidateQueries({
                    queryKey: ['profileData'],
                })
                setSuccessMessage('Profile updated successfully!')
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000)
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log(formValues.error)
        }
    }

    if (response.isLoading) {
        return (
            <>
                <Header />
                <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)'
                }}>
                    <div className="text-center">
                        <div className="spinner-border" style={{
                            width: '3rem',
                            height: '3rem',
                            color: '#667eea'
                        }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted fw-semibold">Loading settings...</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="min-vh-100" style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
                paddingTop: '3rem',
                paddingBottom: '3rem'
            }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h1 className="fw-bold mb-0" style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    ⚙️ Account Settings
                                </h1>
                                <Link to="/user" className="btn btn-outline-secondary" style={{
                                    borderRadius: '12px',
                                    padding: '0.5rem 1.5rem',
                                    fontWeight: '600'
                                }}>
                                    ← Back to Profile
                                </Link>
                            </div>

                            {/* Success Message */}
                            {successMessage && (
                                <div className="alert alert-success border-0 mb-4" style={{
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                                    borderLeft: '4px solid #10b981'
                                }}>
                                    <strong>✅ Success!</strong> {successMessage}
                                </div>
                            )}

                            {/* Error Message */}
                            {profileChangeMutation.error && (
                                <div className="alert alert-danger border-0 mb-4" style={{
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                                    borderLeft: '4px solid #ef4444'
                                }}>
                                    <strong>⚠️ Error:</strong> {profileChangeMutation.error?.message}
                                </div>
                            )}

                            {/* Settings Form */}
                            <div className="card border-0" style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '3rem',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
                            }}>
                                <form action={FormAction}>
                                    {/* Username */}
                                    <div className="mb-4">
                                        <label htmlFor="username" className="form-label fw-semibold">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            className="form-control form-control-lg"
                                            defaultValue={response.data?.data.username}
                                            placeholder="Enter your username"
                                            style={{
                                                borderRadius: '12px',
                                                border: '2px solid #e0e0e0',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label fw-semibold">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-control form-control-lg"
                                            defaultValue={response.data?.data.email}
                                            placeholder="your.email@example.com"
                                            style={{
                                                borderRadius: '12px',
                                                border: '2px solid #e0e0e0',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-semibold">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-control form-control-lg"
                                            placeholder="Leave blank to keep current password"
                                            style={{
                                                borderRadius: '12px',
                                                border: '2px solid #e0e0e0',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                        <small className="text-muted">Only fill this if you want to change your password</small>
                                    </div>

                                    {/* Age and Gender Row */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label htmlFor="age" className="form-label fw-semibold">
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                id="age"
                                                name="age"
                                                className="form-control form-control-lg"
                                                defaultValue={response.data?.data.age || ''}
                                                placeholder="Your age"
                                                style={{
                                                    borderRadius: '12px',
                                                    border: '2px solid #e0e0e0',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label htmlFor="sex" className="form-label fw-semibold">
                                                Gender
                                            </label>
                                            <select
                                                id="sex"
                                                name="sex"
                                                className="form-select form-control-lg"
                                                defaultValue={response.data?.data.sex || ''}
                                                style={{
                                                    borderRadius: '12px',
                                                    border: '2px solid #e0e0e0',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-4">
                                        <label htmlFor="description" className="form-label fw-semibold">
                                            Bio
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="form-control"
                                            rows={5}
                                            defaultValue={response.data?.data.description || ''}
                                            placeholder="Tell us about yourself..."
                                            style={{
                                                borderRadius: '12px',
                                                border: '2px solid #e0e0e0',
                                                transition: 'all 0.3s ease',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>

                                    {/* Photo URL */}
                                    <div className="mb-4">
                                        <label htmlFor="photo" className="form-label fw-semibold">
                                            Profile Photo URL
                                        </label>
                                        <input
                                            type="text"
                                            id="photo"
                                            name="photo"
                                            className="form-control form-control-lg"
                                            defaultValue={response.data?.data.photo || ''}
                                            placeholder="https://example.com/photo.jpg"
                                            style={{
                                                borderRadius: '12px',
                                                border: '2px solid #e0e0e0',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                        {response.data?.data.photo && (
                                            <div className="mt-3 text-center">
                                                <p className="text-muted mb-2">Current Photo:</p>
                                                <img
                                                    src={response.data?.data.photo}
                                                    alt="Profile Preview"
                                                    style={{
                                                        maxWidth: '150px',
                                                        maxHeight: '150px',
                                                        borderRadius: '12px',
                                                        objectFit: 'cover',
                                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-lg w-100 text-white fw-semibold"
                                        disabled={profileChangeMutation.isPending}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                                        }}
                                    >
                                        {profileChangeMutation.isPending ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Updating Profile...
                                            </>
                                        ) : (
                                            <>💾 Save Changes</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
