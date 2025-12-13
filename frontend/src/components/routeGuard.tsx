import { type ReactNode } from 'react'
import { useCookies } from 'react-cookie'
import { Navigate } from 'react-router-dom'

interface RouteGuardProps {
    children: ReactNode
    isLoginRoute?: boolean
}

const RouteGuard = ({
    children,
    isLoginRoute = false,
}: RouteGuardProps): ReactNode => {
    const [cookies] = useCookies(['access_token'])

    // if it's secured route && login route && already authentificated => redirected to home
    if (isLoginRoute && cookies.access_token) {
        return <Navigate to="/" />
    }

    // if it's secured route && not login route && not authentificated => redirected to login
    if (!isLoginRoute && !cookies.access_token) {
        return <Navigate to="/sign_in" />
    }

    // if it's secured route && login route => do nothing
    return children
}

export default RouteGuard
