import { createContext, useContext } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    login: () => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    login: () => {},
    logout: () => {},
})

export const useAuth = () => {
    return useContext(AuthContext)
}
