import { useAuth } from '../contexts/AuthContext'
import { useMyPurchasesQuery } from '../hooks/useMyPurchasesQuery'

export function UserPurchasesPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const { data: myPurchases, isLoading: isMyPurchasesLoading } =
        useMyPurchasesQuery(isAuthenticated)

    if (isLoading || isMyPurchasesLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            UserPurchasesPage
            <div>
                {myPurchases &&
                    myPurchases?.data.purchases.map((course) => (
                        <div key={course.id}>
                            <h2>{`course id: ${course.course_id}`}</h2>
                            <p>{`user id: ${course.user_id}`}</p>
                            <p>{`price: ${course.price}`}</p>
                            <p>{`status: ${course.status}`}</p>
                            <p>{`purchase_date: ${course.purchase_date}`}</p>
                            <p>{`payment_method: ${course.payment_method}`}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}
