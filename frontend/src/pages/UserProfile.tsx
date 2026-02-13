import { Link, Outlet } from 'react-router-dom'
import { getProfileQuery } from '../hooks/useProfileQuery'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const UserProfile = () => {
<<<<<<< HEAD
    const response = getProfileQuery()

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
                        <p className="mt-3 text-muted fw-semibold">Loading profile...</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if (response.error) {
        return (
            <>
                <Header />
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div style={{ fontSize: '5rem' }}>❌</div>
                        <h3 className="text-muted">Error loading profile</h3>
                        <p className="text-muted">{response.error.message}</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    const user = response.data?.data

    return (
        <>
            <Header />
            <div className="min-vh-100" style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
                paddingTop: '3rem',
                paddingBottom: '3rem'
            }}>
                <div className="container">
                    <div className="row g-4">
                        {/* Profile Card */}
                        <div className="col-lg-4">
                            <div className="card border-0" style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '2rem',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                                position: 'sticky',
                                top: '2rem'
                            }}>
                                <div className="text-center mb-4">
                                    {user?.photo ? (
                                        <img
                                            src={user.photo}
                                            alt="Profile"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '5px solid white',
                                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '150px',
                                            height: '150px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            fontSize: '4rem',
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                                        }}>
                                            👤
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-center fw-bold mb-2" style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontSize: '2rem'
                                }}>
                                    {user?.username || 'Anonymous'}
                                </h2>

                                <p className="text-center text-muted mb-4">
                                    <small>{user?.email || 'No email provided'}</small>
                                </p>

                                <Link to="/user/settings" className="text-decoration-none">
                                    <button className="btn btn-lg w-100 text-white fw-semibold" style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '0.875rem',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                                    }}>
                                        ⚙️ Edit Profile
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="col-lg-8">
                            <div className="card border-0 mb-4" style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '2rem',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
                            }}>
                                <h3 className="fw-bold mb-4" style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    About Me
                                </h3>

                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="p-3" style={{
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                            borderRadius: '12px'
                                        }}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '12px',
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem'
                                                }}>
                                                    🎂
                                                </div>
                                                <div>
                                                    <small className="text-muted d-block">Age</small>
                                                    <strong>{user?.age || 'Not specified'}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="p-3" style={{
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                            borderRadius: '12px'
                                        }}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '12px',
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem'
                                                }}>
                                                    {user?.sex === 'male' ? '👨' : user?.sex === 'female' ? '👩' : '👤'}
                                                </div>
                                                <div>
                                                    <small className="text-muted d-block">Gender</small>
                                                    <strong style={{ textTransform: 'capitalize' }}>
                                                        {user?.sex || 'Not specified'}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {user?.description && (
                                    <div className="mt-4">
                                        <h5 className="fw-semibold mb-3">Bio</h5>
                                        <p className="text-muted" style={{ lineHeight: '1.8' }}>
                                            {user.description}
                                        </p>
                                    </div>
                                )}

                                {!user?.description && (
                                    <div className="mt-4 text-center py-4">
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                                        <p className="text-muted">No bio yet. Add one in your settings!</p>
                                    </div>
                                )}
                            </div>

                            {/* Stats Card */}
                            <div className="card border-0" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '20px',
                                padding: '2rem',
                                color: 'white',
                                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)'
                            }}>
                                <h4 className="fw-bold mb-4">My Learning Stats</h4>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📚</div>
                                            <h3 className="mb-0 fw-bold">0</h3>
                                            <small>Enrolled Courses</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                                            <h3 className="mb-0 fw-bold">0</h3>
                                            <small>Completed</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
                                            <h3 className="mb-0 fw-bold">0</h3>
                                            <small>Reviews Written</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
=======
    const { data, error, isLoading } = getProfileQuery()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <>
            <h1>Username: {data?.data.username}</h1>
            <p>
                <label>Email: </label>
                <span>{data?.data.email}</span>
            </p>
            <p>
                <label>Sex: </label>
                <span>{data?.data.sex}</span>
            </p>
            <p>
                <label>Age: </label>
                <span>{data?.data.age}</span>
            </p>
            <p>
                <label>Description: </label>
                <span>{data?.data.description}</span>
            </p>
            <p>
                <label>Photo: </label>
                {data?.data.photo && (
                    <img src={data?.data.photo} alt="Profile photo" />
                )}
            </p>
            <br />
            <Link to="/user/settings">
                <button>Profile Settings</button>
            </Link>
            <Link to="/user/purchases">
                <button>My Purchases</button>
            </Link>
            <Outlet />
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd
        </>
    )
}
