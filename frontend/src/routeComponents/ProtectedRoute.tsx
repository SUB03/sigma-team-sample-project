import { type ReactNode } from 'react'
import { useCookies } from 'react-cookie'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = (): ReactNode => {
    const [cookie] = useCookies(['access_token', 'refresh_token'])
    return cookie.access_token ? (
        <Outlet />
    ) : (
        <Navigate to="/sign_in" replace={false} />
    )
}

export default ProtectedRoute
