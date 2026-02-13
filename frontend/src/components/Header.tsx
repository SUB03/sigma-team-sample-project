import { Link, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useLogoutMutation } from '../mutations/useLogoutMutation'
import { useState } from 'react'

export function Header() {
    const [cookie, , removeCookie] = useCookies([
        'access_token',
        'refresh_token',
    ])
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()
    const logoutMutation = useLogoutMutation()

    const logged_in = cookie.access_token

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await logoutMutation.mutateAsync()
            if (response.status === 205) {
                removeCookie('access_token', { path: '/' })
                removeCookie('refresh_token', { path: '/' })
                navigate('/')
            }
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/results?search=${searchQuery}`)
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light sticky-top" style={{
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.5)'
        }}>
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{
                    fontSize: '1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    <span style={{ fontSize: '1.8rem', marginRight: '0.5rem' }}>🎓</span>
                    <span>Sigma Learning</span>
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <form className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: '500px', flex: 1 }} onSubmit={handleSearch}>
                        <div className="input-group">
                            <input 
                                className="form-control" 
                                type="search" 
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="btn btn-primary" type="submit">
                                🔍
                            </button>
                        </div>
                    </form>

                    <ul className="navbar-nav ms-auto align-items-center gap-2">
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" to="/" style={{
                                transition: 'all 0.3s ease',
                                padding: '0.5rem 1rem'
                            }}>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" to="/results" style={{
                                transition: 'all 0.3s ease',
                                padding: '0.5rem 1rem'
                            }}>
                                Courses
                            </Link>
                        </li>
                        
                        {logged_in ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link fw-semibold" to="/user" style={{
                                        transition: 'all 0.3s ease',
                                        padding: '0.5rem 1rem'
                                    }}>
                                        Profile
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={handleLogout}
                                        disabled={logoutMutation.isPending}
                                        style={{
                                            borderRadius: '8px',
                                            padding: '0.5rem 1.2rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {logoutMutation.isPending ? 'Logging out...' : 'Sign Out'}
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="btn btn-outline-primary btn-sm" to="/sign_in" style={{
                                        borderRadius: '8px',
                                        padding: '0.5rem 1.2rem',
                                        fontWeight: '600'
                                    }}>
                                        Sign In
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-primary btn-sm text-white" to="/sign_up" style={{
                                        borderRadius: '8px',
                                        padding: '0.5rem 1.2rem',
                                        fontWeight: '600',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none'
                                    }}>
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
