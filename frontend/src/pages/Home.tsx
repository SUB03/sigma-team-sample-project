import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useCookies } from 'react-cookie'
import { useLogout } from '../mutations/logoutMutation'

export function Home() {
    const [cookie, , removeCookie] = useCookies([
        'access_token',
        'refresh_token',
    ])

    const logged_in = cookie.access_token
    const destination = logged_in ? '/user' : '/sign_in'
    const user_button = logged_in ? 'Go to Profile' : 'Authorization'
    const logoutMutation = useLogout()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const status = await logoutMutation.mutateAsync()
            if (status === 205) {
                removeCookie('access_token', { path: '/' })
                removeCookie('refresh_token', { path: '/' })
            }
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    return (
        <>
            <Link to={destination}>
                <Button
                    onClick={() => console.log(`redirected to ${destination}`)}
                >
                    {user_button}
                </Button>
            </Link>
            <form onSubmit={handleSubmit}>
                {logged_in && (
                    <button type="submit" disabled={logoutMutation.isPending}>
                        {logoutMutation.isPending ? 'logging out...' : 'logout'}
                    </button>
                )}
            </form>
        </>
    )
}
