import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useCookies } from 'react-cookie'
import { useLogout } from '../mutations/logoutMutation'

export function Home() {
    const [cookies, , removeCookie] = useCookies([
        'access_token',
        'refresh_token',
    ])

    const logged_in = cookies.access_token
    const destination = logged_in ? '/user' : '/sign_in'
    const user_button = logged_in ? 'Go to Profile' : 'Authorization'
    const registerMutation = useLogout()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        registerMutation.mutateAsync()
        console.log('removed')

        removeCookie('access_token', { path: '/' })
        removeCookie('refresh_token', { path: '/' })
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
                    <button type="submit" disabled={registerMutation.isPending}>
                        {registerMutation.isPending
                            ? 'logging out...'
                            : 'logout'}
                    </button>
                )}
            </form>
        </>
    )
}
