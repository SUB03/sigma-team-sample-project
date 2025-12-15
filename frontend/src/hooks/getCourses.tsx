import { useQuery } from '@tanstack/react-query'
import { $api, course_url } from '../api'
import type { PopularCoursesData } from '../types/course'

export const getProfileQuery = () => {
    return useQuery({
        queryKey: ['profileData'],
        queryFn: async () => {
            return $api.get<PopularCoursesData>(
                `${course_url}/courses/popular/`
            )
        },
        staleTime: 5 * 60 * 1000, // данные считаются свежими 5 минут
    })
}
