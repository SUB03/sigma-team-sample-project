import { Link } from 'react-router-dom'
import Button from '../components/Button'

export function Home() {
    return (
        <>
            <Link to="/sign_in">
                <Button onClick={() => console.log('clicked')}>
                    authorization
                </Button>
            </Link>
        </>
    )
}
