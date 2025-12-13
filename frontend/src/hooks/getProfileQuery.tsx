import { useQuery } from '@tanstack/react-query'
import { useCookies } from 'react-cookie'
import { base_url } from '../constants/api'

export const getProfileQuery = () => {
    const [cookies] = useCookies(['access_token'])
    return useQuery({
        queryKey: ['profileData'],
        queryFn: async () => {
            if (!cookies.access_token) {
                throw new Error('No access token found')
            }
            const response = await fetch(`${base_url}/user/profile/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${cookies.access_token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        },
        enabled: !!cookies.access_token,
        retry: 1, // количество повторных попыток при ошибке
        staleTime: 5 * 60 * 1000, // данные считаются свежими 5 минут
    })
}
