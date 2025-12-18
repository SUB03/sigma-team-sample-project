import { type ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PublicRoute = (): ReactNode => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div>Loading...</div>
    }

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace={false} />
}

export default PublicRoute
