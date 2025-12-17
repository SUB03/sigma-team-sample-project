import { Link } from 'react-router-dom'
import { getProfileQuery } from '../hooks/useProfileQuery'

export const UserProfile = () => {
    const respose = getProfileQuery()

    // if (isLoading) return <div>Loading...</div>
    // if (error) return <div>Error: {error.message}</div>
    return (
        <>
            <h1>{respose.data?.data.username}</h1>
            <p>{respose.data?.data.email}</p>
            <p>{respose.data?.data.sex}</p>
            <p>{respose.data?.data.age}</p>
            <p>{respose.data?.data.description}</p>
            <image>{respose.data?.data.photo}</image>
            <br />
            <Link to="/user/settings">
                <button>Profile Settings</button>
            </Link>
            <Link to="/user/purchases">
                <button>My Purchases</button>
            </Link>
        </>
    )
}
