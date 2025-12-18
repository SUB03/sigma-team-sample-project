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

export function CoursePage() {
    const { id } = useParams<{ id: string }>()
    const [editReview, setEditReview] = useState(false)
    const [pagination, setPagination] = useState(1)

    if (!id) {
        return <div>Invalid course ID</div>
    }

    const courseId = parseInt(id, 10)
    // useAuth()
    const { isAuthenticated } = useAuth()

    const navigate = useNavigate()
    //const location = useLocation()
    const purchaseMutation = usePurchaseMutation()
    const useMyReviewsPost = useMyReviewsPostMutation()
    const useMyReviewsUpdate = useMyReviewsUpdateMutation()
    const useMyReviewsDelete = useMyReviewsDeleteMutation()

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
    }

    return (
        <>
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
        </>
    )
}
