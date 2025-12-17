import { useQuery } from '@tanstack/react-query'
import { $api, course_url, reviews_url } from '../api'
import type {
    AllCoursesResponse,
    CourseData,
    CourseReviews,
    PopularCoursesData,
} from '../types/coursesData'

export interface CourseQueryData {
    search?: string
    categories?: string
    url?: string
}

export interface ReviewQueryData {
    id: number
    course_id: number
    user_id: number
    rating: number
    comment: string
    created_at: string
    updated_at: string
}

const retryDelay = 1 * 60 * 1000 // 1 minute
const staleTime = 5 * 60 * 1000 // 5 minutes

export const getPopularCoursesQuery = () => {
    return useQuery({
        queryKey: ['popularCourses'],
        queryFn: async () => {
            return $api.get<PopularCoursesData>(
                `${course_url}/courses/popular/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    skipAuth: true,
                }
            )
        },
        retry: true,
        retryDelay: retryDelay,
        staleTime: staleTime,
    })
}

export const getCoursesQuery = (queryData?: CourseQueryData) => {
    return useQuery({
        queryKey: ['popularCourses', queryData?.search, queryData?.categories],
        queryFn: async () => {
            return $api.get<AllCoursesResponse>(
                queryData?.url || `${course_url}/courses/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    skipAuth: true,
                }
            )
        },
        retry: true,
        retryDelay: retryDelay,
        staleTime: staleTime,
    })
}

export const getCourseQuery = (course_id: number) => {
    return useQuery({
        queryKey: ['course', course_id],
        queryFn: async () => {
            return $api.get<CourseData>(`${course_url}/courses/${course_id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                skipAuth: true,
            })
        },
        retry: true,
        retryDelay: retryDelay,
        staleTime: staleTime,
    })
}

export const getReviewsQuery = (course_id: number, page: number) => {
    return useQuery({
        queryKey: ['reviews', course_id, page],
        queryFn: async () => {
            return $api.get<CourseReviews>(
                `${reviews_url}/reviews/course/${course_id}/?page=${page}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    skipAuth: true,
                }
            )
        },
        retry: true,
        retryDelay: retryDelay,
        staleTime: staleTime,
    })
}

export const useGetMyReview = (course_id: number) => {
    return useQuery({
        queryKey: ['myReview', course_id],
        queryFn: async () => {
            return $api.get<ReviewQueryData>(
                `${reviews_url}/reviews/my-reviews/${course_id}/`
            )
        },
        retry: true,
        retryDelay: retryDelay,
        staleTime: staleTime,
    })
}
