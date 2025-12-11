import { Link } from 'react-router-dom'
import Button from '../components/Button'

export function Home() {
    return (
        <>
            <Link to="/login">
                <Button onClick={() => console.log('clicked')}>Login</Button>
            </Link>
        </>
    )
}
