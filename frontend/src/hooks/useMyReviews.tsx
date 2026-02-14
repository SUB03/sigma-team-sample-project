import { useQuery } from '@tanstack/react-query'
import { $api } from '../api'

export interface UserReview {
    id: number
    user_id: number
    course_id: number
    rating: number
    comment: string
    created_at: string
    updated_at: string
}

interface UserReviewsResponse {
    count: number
    total_pages: number
    current_page: number
    page_size: number
    next: string | null
    previous: string | null
    results: UserReview[]
}

export const useMyReviews = (isAuthenticated: boolean, page: number = 1) => {
    return useQuery({
        queryKey: ['myReviews', page],
        queryFn: async () => {
            try {
                const response = await $api.get<UserReviewsResponse>(`/review/my-reviews/?page=${page}`)
                return response.data
            } catch (error) {
                console.error('Failed to fetch reviews:', error)
                return {
                    count: 0,
                    total_pages: 0,
                    current_page: 1,
                    page_size: 10,
                    next: null,
                    previous: null,
                    results: []
                }
            }
        },
        enabled: isAuthenticated,
        staleTime: 2 * 60 * 1000,
    })
}
