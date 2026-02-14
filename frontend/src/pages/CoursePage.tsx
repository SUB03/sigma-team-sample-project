import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
    getCourseQuery,
    getReviewsQuery,
    useGetMyReview,
} from '../hooks/useCourses'
import { usePurchaseMutation } from '../mutations/purchaseMutation'
import { usePurchaseCheckQuery } from '../hooks/usePurchaseCheckQuery'
import {
    useMyReviewsDeleteMutation,
    useMyReviewsPostMutation,
    useMyReviewsUpdateMutation,
} from '../mutations/reviewsMutations'
import { useAuth } from '../contexts/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import Pagination from '../components/Pagination'

const commentSchema = z.object({
    rating: z.string().transform((val) => parseInt(val, 10)),
    comment: z.string(),
})

export function CoursePage() {
    const { id } = useParams<{ id: string }>()
    const [editReview, setEditReview] = useState(false)
    const [pagination, setPagination] = useState(1)
    const [showReviewForm, setShowReviewForm] = useState(false)

    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const queryClient = useQueryClient()

    const purchaseMutation = usePurchaseMutation()
    const useMyReviewsPost = useMyReviewsPostMutation()
    const useMyReviewsUpdate = useMyReviewsUpdateMutation()
    const useMyReviewsDelete = useMyReviewsDeleteMutation()

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

    const { data: purchaseCheckResponse, isLoading: purchaseCheckLoading } =
        usePurchaseCheckQuery(courseId, isAuthenticated)
    
    const hasPurchased = purchaseCheckResponse?.data.has_purchased || false
    
    const { data: userReviewResponse } = useGetMyReview(
        courseId,
        isAuthenticated,
        hasPurchased
    )
    const {
        data: reviewsResponse,
        isLoading: reviewsLoading,
        refetch: refetchAllReviews,
    } = getReviewsQuery(courseId, pagination)
    const { data: course, isLoading: courseLoading } = getCourseQuery(courseId)

    useEffect(() => {
        refetchAllReviews()
    }, [pagination, refetchAllReviews])

    async function SubmitCommentFormAction(form_data: FormData) {
        const commentForm = commentSchema.safeParse(
            Object.fromEntries(form_data)
        )

        if (commentForm.success) {
            try {
                if (userReviewResponse) {
                    await useMyReviewsUpdate.mutateAsync({
                        review_id: userReviewResponse.data.id,
                        ...commentForm.data,
                    })
                } else {
                    await useMyReviewsPost.mutateAsync({
                        course_id: courseId,
                        ...commentForm.data,
                    })
                }
                queryClient.invalidateQueries({ queryKey: ['reviews', courseId] })
                queryClient.invalidateQueries({ queryKey: ['my-review', courseId] })
                setEditReview(false)
                setShowReviewForm(false)
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleDeleteComment = async (id: number) => {
        try {
            await useMyReviewsDelete.mutateAsync(id)
            queryClient.invalidateQueries({ queryKey: ['reviews', courseId] })
            queryClient.invalidateQueries({ queryKey: ['my-review', courseId] })
        } catch (err) {
            console.log(err)
        }
    }

    const handlePageChange = (page: number) => {
        setPagination(page)
    }

    const handlePurchase = async () => {
        if (!isAuthenticated) {
            navigate('/sign_in')
            return
        }
        try {
            await purchaseMutation.mutateAsync({
                course_id: courseId,
            })
            await queryClient.invalidateQueries({
                queryKey: ['Purchased', courseId],
            })
        } catch (error) {
            console.error('Purchase failed:', error)
        }
    }

    if (courseLoading) {
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

    if (!course) {
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
                                            <strong>{reviewsResponse?.data.count || 0} review{reviewsResponse?.data.count !== 1 ? 's' : ''}</strong>
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
                                            ${Number(course.data.price).toFixed(2)}
                                        </h2>
                                    </div>
                                    {purchaseCheckLoading ? (
                                        <button className="btn btn-light btn-lg w-100 fw-semibold" disabled style={{
                                            borderRadius: '12px',
                                            padding: '1rem'
                                        }}>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Loading...
                                        </button>
                                    ) : hasPurchased ? (
                                        <button className="btn btn-light btn-lg w-100 fw-semibold" style={{
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                                        }}>
                                            ✅ Enrolled - Go to Course
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-light btn-lg w-100 fw-semibold" 
                                            onClick={handlePurchase}
                                            disabled={purchaseMutation.isPending}
                                            style={{
                                                borderRadius: '12px',
                                                padding: '1rem',
                                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                                            }}
                                        >
                                            {purchaseMutation.isPending ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Processing...
                                                </>
                                            ) : (
                                                'Enroll Now'
                                            )}
                                        </button>
                                    )}
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
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fw-bold mb-0" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                Student Reviews
                            </h2>
                            {isAuthenticated && hasPurchased && !userReviewResponse && !showReviewForm && (
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => setShowReviewForm(true)}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '0.5rem 1.5rem'
                                    }}
                                >
                                    ✍️ Write Review
                                </button>
                            )}
                        </div>

                        {/* User's Review or Review Form */}
                        {isAuthenticated && hasPurchased && (userReviewResponse || showReviewForm || editReview) && (
                            <div className="card border-0 mb-4" style={{
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                borderRadius: '16px',
                                padding: '2rem'
                            }}>
                                {userReviewResponse && !editReview ? (
                                    <>
                                        <h5 className="fw-bold mb-3">Your Review</h5>
                                        <div className="d-flex align-items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} style={{
                                                    fontSize: '1.5rem',
                                                    color: i < userReviewResponse.data.rating ? '#fbbf24' : '#d1d5db'
                                                }}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <p className="mb-3">{userReviewResponse.data.comment}</p>
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => setEditReview(true)}
                                                style={{ borderRadius: '8px' }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDeleteComment(userReviewResponse.data.id)}
                                                style={{ borderRadius: '8px' }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h5 className="fw-bold mb-3">{editReview ? 'Edit Review' : 'Write a Review'}</h5>
                                        <form action={SubmitCommentFormAction}>
                                            <div className="mb-3">
                                                <label htmlFor="rating" className="form-label fw-semibold">Rating</label>
                                                <select 
                                                    id="rating" 
                                                    name="rating" 
                                                    className="form-select"
                                                    defaultValue={userReviewResponse?.data.rating || '5'}
                                                    required
                                                    style={{
                                                        borderRadius: '12px',
                                                        border: '2px solid #e0e0e0'
                                                    }}
                                                >
                                                    <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
                                                    <option value="4">⭐⭐⭐⭐ Good (4)</option>
                                                    <option value="3">⭐⭐⭐ Average (3)</option>
                                                    <option value="2">⭐⭐ Poor (2)</option>
                                                    <option value="1">⭐ Terrible (1)</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="comment" className="form-label fw-semibold">Comment</label>
                                                <textarea 
                                                    id="comment" 
                                                    name="comment" 
                                                    className="form-control"
                                                    rows={4}
                                                    defaultValue={userReviewResponse?.data.comment || ''}
                                                    placeholder="Share your thoughts about this course..."
                                                    required
                                                    style={{
                                                        borderRadius: '12px',
                                                        border: '2px solid #e0e0e0'
                                                    }}
                                                />
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        padding: '0.5rem 1.5rem'
                                                    }}
                                                >
                                                    💾 Submit Review
                                                </button>
                                                <button 
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => {
                                                        setEditReview(false)
                                                        setShowReviewForm(false)
                                                    }}
                                                    style={{
                                                        borderRadius: '12px',
                                                        padding: '0.5rem 1.5rem'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        )}

                        {/* All Reviews */}
                        {reviewsLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: '#667eea' }}></div>
                                <p className="mt-3 text-muted">Loading reviews...</p>
                            </div>
                        ) : !reviewsResponse || reviewsResponse.data.results.length === 0 ? (
                            <div className="text-center py-5">
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                                <p className="text-muted">No reviews yet. Be the first to review this course!</p>
                            </div>
                        ) : (
                            <>
                                <div className="row g-4">
                                    {reviewsResponse.data.results.map((review) => (
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
                                                                fontSize: '1.5rem',
                                                                color: i < review.rating ? '#fbbf24' : '#d1d5db'
                                                            }}>
                                                                ★
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
                                {reviewsResponse.data.total_pages > 1 && (
                                    <div className="mt-4">
                                        <Pagination
                                            currentPage={reviewsResponse.data.current_page}
                                            totalPages={reviewsResponse.data.total_pages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
