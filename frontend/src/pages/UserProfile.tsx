import { Link, Outlet } from 'react-router-dom'
import { getProfileQuery } from '../hooks/useProfileQuery'

export const UserProfile = () => {
    const { data, error, isLoading } = getProfileQuery()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <>
            <h1>Username: {data?.data.username}</h1>
            <p>
                <label>Email: </label>
                <span>{data?.data.email}</span>
            </p>
            <p>
                <label>Sex: </label>
                <span>{data?.data.sex}</span>
            </p>
            <p>
                <label>Age: </label>
                <span>{data?.data.age}</span>
            </p>
            <p>
                <label>Description: </label>
                <span>{data?.data.description}</span>
            </p>
            <p>
                <label>Photo: </label>
                {data?.data.photo && (
                    <img src={data?.data.photo} alt="Profile photo" />
                )}
            </p>
            <br />
            <Link to="/user/settings">
                <button>Profile Settings</button>
            </Link>
            <Link to="/user/purchases">
                <button>My Purchases</button>
            </Link>
            <Outlet />
        </>
    )
}
