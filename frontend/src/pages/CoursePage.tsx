import z from 'zod'
import { useParams } from 'react-router-dom'
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
import { useCookies } from 'react-cookie'

const commentSchema = z.object({
    rating: z.string().transform((val) => parseInt(val, 10)),
    comment: z.string(),
})

export function CoursePage() {
    const { id } = useParams<{ id: string }>()
    const [editReview, setEditReview] = useState(false)
    const [pagination, setPagination] = useState(1)
    //const [cookie] = useCookies(['access_token'])

    if (!id) {
        return <div>Invalid course ID</div>
    }

    const courseId = parseInt(id, 10)
    const purchaseMutation = usePurchaseMutation()
    const useMyReviewsPost = useMyReviewsPostMutation()
    const useMyReviewsUpdate = useMyReviewsUpdateMutation()
    const useMyReviewsDelete = useMyReviewsDeleteMutation()

    const { data: hasPurchased } = usePurchaseCheckQuery(courseId)
    const { data: userReview } = useGetMyReview(courseId)
    const { data: reviews, refetch: refetchAllReviews } = getReviewsQuery(
        courseId,
        pagination
    )
    const { data: course } = getCourseQuery(courseId)
    const queryClient = useQueryClient()

    async function SubmitCommentFormAction(form_data: FormData) {
        console.log(form_data)
        const commentForm = commentSchema.safeParse(
            Object.fromEntries(form_data)
        )
        console.log(commentForm.data)

        if (commentForm.success) {
            try {
                if (userReview) {
                    console.log('userReview', userReview)
                    await useMyReviewsUpdate.mutateAsync({
                        review_id: userReview.data.id,
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
    }, [pagination, refetchAllReviews])

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

    if (!course || !reviews) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div>
                <h1>{course.data.title}</h1>
                <p>{course.data.description}</p>
                <p>Price: {course.data.price}</p>
                <p>Popularity: {course.data.popularity}</p>
            </div>

            <div>
                {!hasPurchased ? (
                    <div>Loading...</div>
                ) : hasPurchased.data.has_purchased ? (
                    <button>Go to Course</button>
                ) : (
                    <button
                        onClick={async () => {
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
            {userReview && !editReview ? (
                <>
                    <h1>Your review</h1>
                    <div>
                        <p>Rating: {userReview.data.rating}</p>
                        <p>{userReview.data.comment}</p>
                    </div>
                    <button onClick={() => setEditReview(true)}>Edit</button>
                    <button
                        onClick={() => handleDeleteComment(userReview.data.id)}
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
            {reviews.data.results.length === 0 && <p>No reviews yet.</p>}
            {reviews.data.results.map((review) => (
                <div key={review.id}>
                    <p>Rating: {review.rating}</p>
                    <p>{review.user_id}</p>
                    <p>{review.comment}</p>
                    <p>{review.created_at}</p>
                </div>
            ))}
            <Pagination
                currentPage={reviews.data.current_page}
                totalPages={reviews.data.total_pages}
                onPageChange={handlePageChange}
            />
        </>
    )
}
