import { useQuery } from '@tanstack/react-query'
import { $api, purchase_url } from '../api'

export interface purchaseData {
    id: number
    user_id: number
    course_id: number
    price: number
    status: string
    purchase_date: string
    payment_method: string
}
export interface MyPurchasesResponse {
    count: number
    purchases: purchaseData[]
}
export const useMyPurchasesQuery = (isAuthenticated: boolean) => {
    return useQuery({
        queryKey: ['MyPurchases'],
        queryFn: async () => {
            return $api.get<MyPurchasesResponse>(
                `${purchase_url}/purchase/my-purchases/`
            )
        },
        staleTime: 5 * 60 * 1000, // данные считаются свежими 5 минут
        enabled: isAuthenticated,
    })
}
