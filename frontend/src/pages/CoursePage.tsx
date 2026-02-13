import { useParams } from 'react-router-dom'
import { getCourseQuery, getReviewsQuery } from '../hooks/useCourses'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export function CoursePage() {
    const { id } = useParams<{ id: string }>()

    if (!id) {
        return (
            <>
                <Header />
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div style={{ fontSize: '5rem' }}>❌</div>
                        <h3 className="text-muted">Invalid course ID</h3>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    const courseId = parseInt(id, 10)
    const { data: reviews, isLoading: reviewsLoading } = getReviewsQuery(courseId)
    const { data: course, isLoading: courseLoading } = getCourseQuery(courseId)

    console.log(reviews)
    console.log(course)

    if (courseLoading || reviewsLoading) {
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
                        <p className="mt-3 text-muted fw-semibold">Loading course...</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if (!course || !reviews) {
        return (
            <>
                <Header />
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div style={{ fontSize: '5rem' }}>😔</div>
                        <h3 className="text-muted">Course not found</h3>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    const difficultyColors: Record<string, string> = {
        'Beginner': 'success',
        'Intermediate': 'warning',
        'Advanced': 'danger'
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
                    {/* Course Header */}
                    <div className="card border-0 mb-4" style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '3rem',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
                    }}>
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <span className={`badge bg-${difficultyColors[course.data.difficulty_level]}`} style={{
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem',
                                        borderRadius: '8px'
                                    }}>
                                        {course.data.difficulty_level}
                                    </span>
                                    <span className="badge bg-secondary" style={{
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem',
                                        borderRadius: '8px'
                                    }}>
                                        {course.data.category}
                                    </span>
                                </div>
                                
                                <h1 className="fw-bold mb-3" style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontSize: '2.5rem'
                                }}>
                                    {course.data.title}
                                </h1>
                                
                                <p className="text-muted mb-4" style={{ 
                                    fontSize: '1.1rem',
                                    lineHeight: '1.8'
                                }}>
                                    {course.data.description}
                                </p>

                                <div className="d-flex flex-wrap gap-4 mb-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                                        <div>
                                            <small className="text-muted d-block">Duration</small>
                                            <strong>{course.data.duration_hours} hours</strong>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span style={{ fontSize: '1.5rem' }}>👥</span>
                                        <div>
                                            <small className="text-muted d-block">Popularity</small>
                                            <strong>{course.data.popularity} students</strong>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span style={{ fontSize: '1.5rem' }}>⭐</span>
                                        <div>
                                            <small className="text-muted d-block">Reviews</small>
                                            <strong>{reviews.data.reviews.length} review{reviews.data.reviews.length !== 1 ? 's' : ''}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card border-0" style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    padding: '2rem',
                                    borderRadius: '16px',
                                    color: 'white'
                                }}>
                                    <div className="text-center mb-3">
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                                        <h2 className="mb-0" style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                                            ${course.data.price.toFixed(2)}
                                        </h2>
                                    </div>
                                    <button className="btn btn-light btn-lg w-100 fw-semibold" style={{
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        Enroll Now
                                    </button>
                                    {course.data.is_limited && course.data.quantity && (
                                        <div className="mt-3 text-center">
                                            <small className="d-flex align-items-center justify-content-center gap-2">
                                                <span>⚡</span>
                                                Only {course.data.quantity} spots left!
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="card border-0" style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '3rem',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
                    }}>
                        <h2 className="fw-bold mb-4" style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Student Reviews
                        </h2>

                        {reviews.data.reviews.length === 0 ? (
                            <div className="text-center py-5">
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                                <p className="text-muted">No reviews yet. Be the first to review this course!</p>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {reviews.data.reviews.map((review) => (
                                    <div key={review.id} className="col-12">
                                        <div className="card border-0" style={{
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                            borderRadius: '16px',
                                            padding: '1.5rem'
                                        }}>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontSize: '1.5rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        👤
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0 fw-bold">User {review.user_id}</h6>
                                                        <small className="text-muted">
                                                            {new Date(review.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} style={{
                                                            fontSize: '1.2rem',
                                                            color: i < review.rating ? '#fbbf24' : '#e0e0e0'
                                                        }}>
                                                            ⭐
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mb-0" style={{ lineHeight: '1.8' }}>
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
