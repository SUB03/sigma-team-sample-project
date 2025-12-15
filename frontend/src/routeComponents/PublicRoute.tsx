import { type ReactNode } from 'react'
import { useCookies } from 'react-cookie'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = (): ReactNode => {
    const [cookies] = useCookies(['access_token'])

    return !cookies.access_token ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace={false} />
    )
}

export default PublicRoute
