import { useQuery } from '@tanstack/react-query'
import { $api } from '../api'

export interface CategoriesData {
    count: number
    categories: string[]
}

export const getCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            return $api.get<CategoriesData>(
                'http://localhost:8003/courses/categories/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    skipAuth: true,
                }
            )
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // data is considered fresh for 5 minutes
    })
}
