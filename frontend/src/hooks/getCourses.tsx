import { useQuery } from '@tanstack/react-query'
import { $api, course_url } from '../api'
import type { AllCoursesResponse, PopularCoursesData } from '../types/course'

export interface CourseQueryData {
    search?: string
    categories?: string
    url?: string
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
