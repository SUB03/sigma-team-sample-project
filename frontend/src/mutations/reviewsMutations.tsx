import { useMutation } from '@tanstack/react-query'
import { $api, reviews_url } from '../api'

interface ReviewPostData {
    course_id: number
    rating: number
    comment: string
}

interface ReviewUpdateData {
    review_id: number
    rating: number
    comment: string
}

export const useMyReviewsPostMutation = () => {
    return useMutation({
        mutationFn: async (data: ReviewPostData) => {
            return await $api.post(
                `${reviews_url}/reviews/course/${data.course_id}/add/`,
                {
                    rating: data.rating,
                    comment: data.comment,
                }
            )
        },
    })
}

export const useMyReviewsUpdateMutation = () => {
    return useMutation({
        mutationFn: async (data: ReviewUpdateData) => {
            return await $api.put(
                `${reviews_url}/reviews/${data.review_id}/update/`,
                {
                    rating: data.rating,
                    comment: data.comment,
                }
            )
        },
    })
}

export const useMyReviewsDeleteMutation = () => {
    return useMutation({
        mutationFn: async (review_id: number) => {
            return await $api.delete(
                `${reviews_url}/reviews/${review_id}/delete/`
            )
        },
    })
}
