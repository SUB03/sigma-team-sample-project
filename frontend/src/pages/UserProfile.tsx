import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getProfileQuery } from '../hooks/useProfileQuery'
import { useMyPurchasedCourses } from '../hooks/useMyPurchases'
import { useMyReviews } from '../hooks/useMyReviews'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'

export const UserProfile = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const response = getProfileQuery()
    const [reviewsPage, setReviewsPage] = useState(1)
    
    const { data: purchasedCourses, isLoading: coursesLoading } = useMyPurchasedCourses(isAuthenticated)
    const { data: reviewsData, isLoading: reviewsLoading } = useMyReviews(isAuthenticated, reviewsPage)

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
                            <div className="card border-0 mb-4" style={{
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
                                            <h3 className="mb-0 fw-bold">{purchasedCourses?.length || 0}</h3>
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
                                            <h3 className="mb-0 fw-bold">{reviewsData?.count || 0}</h3>
                                            <small>Reviews Written</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Purchased Courses Section */}
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
                                    📚 My Courses
                                </h3>

                                {coursesLoading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border" style={{ color: '#667eea' }}></div>
                                        <p className="mt-3 text-muted">Loading courses...</p>
                                    </div>
                                ) : !purchasedCourses || purchasedCourses.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📖</div>
                                        <p className="text-muted">You haven't enrolled in any courses yet.</p>
                                        <Link to="/">
                                            <button className="btn btn-primary mt-2" style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '0.5rem 1.5rem'
                                            }}>
                                                Browse Courses
                                            </button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="row g-3">
                                        {purchasedCourses.map((course) => (
                                            <div key={course.id} className="col-12">
                                                <div 
                                                    className="card border-0" 
                                                    onClick={() => navigate(`/courses/${course.id}`)}
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                                        borderRadius: '12px',
                                                        padding: '1.25rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.2)'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)'
                                                        e.currentTarget.style.boxShadow = 'none'
                                                    }}
                                                >
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div className="flex-grow-1">
                                                            <h5 className="fw-bold mb-2">{course.title}</h5>
                                                            <p className="text-muted mb-2 small" style={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical'
                                                            }}>
                                                                {course.description}
                                                            </p>
                                                            <div className="d-flex gap-3 align-items-center">
                                                                <small className="text-muted">
                                                                    <strong>Purchased:</strong> {new Date(course.purchase_date).toLocaleDateString()}
                                                                </small>
                                                                <span className={`badge bg-${course.difficulty_level === 'Beginner' ? 'success' : course.difficulty_level === 'Intermediate' ? 'warning' : 'danger'}`}>
                                                                    {course.difficulty_level}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-end ms-3">
                                                            <div className="fw-bold" style={{
                                                                fontSize: '1.25rem',
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent',
                                                                backgroundClip: 'text'
                                                            }}>
                                                                ${course.purchase_price.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reviews Section */}
                            <div className="card border-0" style={{
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
                                    ⭐ My Reviews
                                </h3>

                                {reviewsLoading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border" style={{ color: '#667eea' }}></div>
                                        <p className="mt-3 text-muted">Loading reviews...</p>
                                    </div>
                                ) : !reviewsData || !reviewsData.results || reviewsData.results.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                                        <p className="text-muted">You haven't written any reviews yet.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="row g-3">
                                            {reviewsData.results.map((review) => (
                                                <div key={review.id} className="col-12">
                                                    <div className="card border-0" style={{
                                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                                        borderRadius: '12px',
                                                        padding: '1.25rem'
                                                    }}>
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div className="d-flex align-items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <span key={i} style={{
                                                                        fontSize: '1.25rem',
                                                                        color: i < review.rating ? '#fbbf24' : '#d1d5db'
                                                                    }}>
                                                                        ★
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <small className="text-muted">
                                                                {new Date(review.created_at).toLocaleDateString()}
                                                            </small>
                                                        </div>
                                                        <p className="mb-0 text-muted">{review.comment}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {reviewsData.total_pages > 1 && (
                                            <div className="mt-3 d-flex justify-content-center gap-2">
                                                {reviewsPage > 1 && (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => setReviewsPage(reviewsPage - 1)}
                                                        style={{ borderRadius: '8px' }}
                                                    >
                                                        ← Previous
                                                    </button>
                                                )}
                                                <span className="align-self-center px-3">
                                                    Page {reviewsPage} of {reviewsData.total_pages}
                                                </span>
                                                {reviewsPage < reviewsData.total_pages && (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => setReviewsPage(reviewsPage + 1)}
                                                        style={{ borderRadius: '8px' }}
                                                    >
                                                        Next →
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <Outlet />
        </>
    )
}
