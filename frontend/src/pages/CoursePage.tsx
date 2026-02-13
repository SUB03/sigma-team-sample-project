<<<<<<< HEAD
import { useParams } from 'react-router-dom'
import { getCourseQuery, getReviewsQuery } from '../hooks/useCourses'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
=======
import z from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import {
    getCourseQuery,
    getReviewsQuery,
    useGetMyReview,
} from '../hooks/useCourses'
import { usePurchaseMutation } from '../mutations/purchaseMutation'
import { usePurchaseCheckQuery } from '../hooks/usePurchaseCheckQuery'
import { useQueryClient } from '@tanstack/react-query'
import Pagination from '../components/Pagination'
import { useEffect, useState } from 'react'
import {
    useMyReviewsDeleteMutation,
    useMyReviewsPostMutation,
    useMyReviewsUpdateMutation,
} from '../mutations/reviewsMutations'
import { useAuth } from '../contexts/AuthContext'

const commentSchema = z.object({
    rating: z.string().transform((val) => parseInt(val, 10)),
    comment: z.string(),
})
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd

export function CoursePage() {
    const { id } = useParams<{ id: string }>()
    const [editReview, setEditReview] = useState(false)
    const [pagination, setPagination] = useState(1)

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
<<<<<<< HEAD
    const { data: reviews, isLoading: reviewsLoading } = getReviewsQuery(courseId)
    const { data: course, isLoading: courseLoading } = getCourseQuery(courseId)
=======
    // useAuth()
    const { isAuthenticated } = useAuth()
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd

    const navigate = useNavigate()
    //const location = useLocation()
    const purchaseMutation = usePurchaseMutation()
    const useMyReviewsPost = useMyReviewsPostMutation()
    const useMyReviewsUpdate = useMyReviewsUpdateMutation()
    const useMyReviewsDelete = useMyReviewsDeleteMutation()

<<<<<<< HEAD
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
=======
    const { data: purchaseCheckResponse, isLoading: purchaseCheckLoading } =
        usePurchaseCheckQuery(courseId, isAuthenticated)
    const { data: userReviewResponse } = useGetMyReview(
        courseId,
        isAuthenticated
    )
    const {
        data: reviewsResponse,
        isLoading: reviewsLoading,
        refetch: refetchAllReviews,
    } = getReviewsQuery(courseId, pagination)
    const { data: courseResponse } = getCourseQuery(courseId)
    const queryClient = useQueryClient()

    async function SubmitCommentFormAction(form_data: FormData) {
        console.log(form_data)
        const commentForm = commentSchema.safeParse(
            Object.fromEntries(form_data)
        )
        console.log(commentForm.data)

        if (commentForm.success) {
            try {
                if (userReviewResponse) {
                    console.log('userReview', userReviewResponse)
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
            } catch (err) {
                console.log(err)
            }
            setEditReview(false)
        }
    }

    // when pagination changes refetch
    useEffect(() => {
        refetchAllReviews()
    }, [pagination])

    const handleDeleteComment = async (id: number) => {
        try {
            await useMyReviewsDelete.mutateAsync(id)
            queryClient.invalidateQueries({ queryKey: ['reviews', courseId] })
        } catch (err) {
            console.log(err)
        }
    }

    const handlePageChange = (page: number) => {
        console.log(page)
        setPagination(page)
    }

    // TODO: if not isCouerseLoading then show 404 or error
    if (!courseResponse) {
        return <div>Loading...</div>
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd
    }

    return (
        <>
<<<<<<< HEAD
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
=======
            <div>
                <h1>{courseResponse.data.title}</h1>
                <p>{courseResponse.data.description}</p>
                <p>Price: {courseResponse.data.price}</p>
                <p>Popularity: {courseResponse.data.popularity}</p>
            </div>

            <div>
                {purchaseCheckLoading ? (
                    <div>Loading...</div>
                ) : isAuthenticated &&
                  purchaseCheckResponse &&
                  purchaseCheckResponse.data.has_purchased ? (
                    <button>Go to Course</button>
                ) : (
                    <button
                        onClick={async () => {
                            if (!isAuthenticated) {
                                navigate('/sign_in')
                            }
                            try {
                                const response =
                                    await purchaseMutation.mutateAsync({
                                        course_id: courseId,
                                    })
                                console.log(response)

                                await queryClient.invalidateQueries({
                                    queryKey: ['Purchased', courseId],
                                })
                            } catch (error) {
                                console.error('Purchase failed:', error)
                            }
                        }}
                    >
                        Buy Now
                    </button>
                )}
            </div>

            <h2>Reviews</h2>
            {!isAuthenticated ? (
                <></>
            ) : userReviewResponse && !editReview ? (
                <>
                    <h1>Your review</h1>
                    <div>
                        <p>Rating: {userReviewResponse.data.rating}</p>
                        <p>{userReviewResponse.data.comment}</p>
                    </div>
                    <button onClick={() => setEditReview(true)}>Edit</button>
                    <button
                        onClick={() =>
                            handleDeleteComment(userReviewResponse.data.id)
                        }
                    >
                        Delete
                    </button>
                    <br />
                </>
            ) : (
                <>
                    <h1>Write your review</h1>
                    <form action={SubmitCommentFormAction}>
                        <label htmlFor="rating">Rating:</label>
                        <input
                            type="number"
                            id="rating"
                            name="rating"
                            min="1"
                            max="5"
                            required
                        />
                        <br />
                        <label htmlFor="comment">Comment:</label>
                        <input
                            type="text"
                            id="comment"
                            name="comment"
                            required
                        />
                        <br />
                        <button>Submit</button>
                    </form>
                </>
            )}
            {reviewsLoading ? (
                <p>Loading...</p>
            ) : !reviewsResponse ||
              reviewsResponse.data.results.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <>
                    {reviewsResponse.data.results.map((review) => (
                        <div key={review.id}>
                            <p>Rating: {review.rating}</p>
                            <p>{review.user_id}</p>
                            <p>{review.comment}</p>
                            <p>{review.created_at}</p>
                        </div>
                    ))}
                    <Pagination
                        currentPage={reviewsResponse.data.current_page}
                        totalPages={reviewsResponse.data.total_pages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd
        </>
    )
}
