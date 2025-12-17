import { useParams } from 'react-router-dom'
import { getCourseQuery, getReviewsQuery } from '../hooks/useCourses'

export function CoursePage() {
    const { id } = useParams<{ id: string }>()

    if (!id) {
        return <div>Invalid course ID</div>
    }

    const courseId = parseInt(id, 10)
    const { data: reviews } = getReviewsQuery(courseId)
    const { data: course } = getCourseQuery(courseId)

    console.log(reviews)
    console.log(course)

    if (!course || !reviews) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>{course.data.title}</h1>
            <p>{course.data.description}</p>
            <p>Price: {course.data.price}</p>
            <p>Popularity: {course.data.popularity}</p>
            <h2>Reviews</h2>
            {reviews.data.reviews.length === 0 && <p>No reviews yet.</p>}
            {reviews.data.reviews.map((review) => (
                <div key={review.id}>
                    <p>Rating: {review.rating}</p>
                    <p>{review.user_id}</p>
                    <p>{review.comment}</p>
                    <p>{review.created_at}</p>
                </div>
            ))}
        </div>
    )
}
