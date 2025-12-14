import { Link } from 'react-router-dom'
import { getProfileQuery } from '../hooks/getProfileQuery'

export const UserProfile = () => {
    const { data, isLoading, error } = getProfileQuery()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    return (
        <>
            <h1>{data.username}</h1>
            <p>{data.email}</p>
            <p>{data.sex}</p>
            <p>{data.age}</p>
            <p>{data.description}</p>
            <image>{data.photo}</image>
            <br />
            <Link to="/user/settings">
                <button
                    onClick={() => console.log(`redirected to /user/profile`)}
                >
                    Profile Settings
                </button>
            </Link>
        </>
    )
}
