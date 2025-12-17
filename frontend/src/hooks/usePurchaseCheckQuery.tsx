import { useQuery } from '@tanstack/react-query'
import { $api, purchase_url } from '../api'

export interface PurchaseCheckResponse {
    user_id: number
    course_id: number
    has_purchased: boolean
}

export const usePurchaseCheckQuery = (course_id: number) => {
    return useQuery({
        queryKey: ['Purchased', course_id],
        queryFn: async () => {
            return $api.get<PurchaseCheckResponse>(
                `${purchase_url}/purchase/check/${course_id}/`
            )
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // данные считаются свежими 5 минут
    })
}
