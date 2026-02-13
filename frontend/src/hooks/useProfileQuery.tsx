import { useQuery } from '@tanstack/react-query'
import { $api } from '../api'

interface UserProfile {
    id: number
    username: string
    email: string
    photo: string
    description: string
    sex: string
    age: number
}

export const getProfileQuery = () => {
    return useQuery({
        queryKey: ['profileData'],
        queryFn: async () => {
            return $api.get<UserProfile>('/user/profile/')
        },
<<<<<<< HEAD
        retry: 1,
        staleTime: 5 * 60 * 1000, // data is considered fresh for 5 minutes
=======
        staleTime: 5 * 60 * 1000, // данные считаются свежими 5 минут
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd
    })
}
