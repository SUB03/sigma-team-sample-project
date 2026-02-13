import { type ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = (): ReactNode => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div>Loading...</div>
    }

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/sign_in" replace={false} />
    )
}

export default ProtectedRoute
