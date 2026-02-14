import { useQuery } from '@tanstack/react-query'
import { $api } from '../api'
import type { CourseData } from '../types/coursesData'

interface Purchase {
    id: number
    user_id: number
    course_id: number
    price: number
    status: string
    payment_method: string
    created_at: string
}

interface PurchasesResponse {
    count: number
    purchases: Purchase[]
}

interface PurchasedCourse extends CourseData {
    purchase_date: string
    purchase_price: number
}

export const useMyPurchases = (isAuthenticated: boolean) => {
    return useQuery({
        queryKey: ['myPurchases'],
        queryFn: async () => {
            try {
                const response = await $api.get<PurchasesResponse>('/purchase/my-purchases/')
                return response.data
            } catch (error) {
                console.error('Failed to fetch purchases:', error)
                return {
                    count: 0,
                    purchases: []
                }
            }
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    })
}

export const useMyPurchasedCourses = (isAuthenticated: boolean) => {
    return useQuery({
        queryKey: ['myPurchasedCourses'],
        queryFn: async () => {
            try {
                // Получаем список покупок
                const purchasesResponse = await $api.get<PurchasesResponse>('/purchase/my-purchases/')
                const purchases = purchasesResponse.data?.purchases || []
                
                if (purchases.length === 0) {
                    return []
                }
                
                // Получаем данные о каждом курсе
                const coursesPromises = purchases.map(async (purchase) => {
                    try {
                        const courseResponse = await $api.get<CourseData>(`/api/courses/${purchase.course_id}/`)
                        return {
                            ...courseResponse.data,
                            purchase_date: purchase.created_at,
                            purchase_price: purchase.price
                        } as PurchasedCourse
                    } catch (error) {
                        console.error(`Failed to fetch course ${purchase.course_id}:`, error)
                        return null
                    }
                })
                
                const courses = await Promise.all(coursesPromises)
                return courses.filter((course): course is PurchasedCourse => course !== null)
            } catch (error) {
                console.error('Failed to fetch purchased courses:', error)
                return []
            }
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    })
}
