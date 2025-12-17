import { useMutation } from '@tanstack/react-query'
import { $api, purchase_url } from '../api'

interface PaymentData {
    course_id: number
    payment_method?: string
}

export const usePurchaseMutation = () => {
    return useMutation({
        mutationFn: async (paymentData: PaymentData) => {
            return $api.post(`${purchase_url}/purchase/create/`, paymentData)
        },
    })
}
