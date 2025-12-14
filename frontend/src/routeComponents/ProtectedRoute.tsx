import { type ReactNode } from 'react'
import { useCookies } from 'react-cookie'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = (): ReactNode => {
    const [cookies] = useCookies(['access_token'])

    return cookies.access_token ? <Outlet /> : <Navigate to="/sign_in" />
}

export default ProtectedRoute
