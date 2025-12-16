import { useSearchParams } from 'react-router-dom'
import { course_url } from '../api'
import CourseCard from '../components/CourseCard'
import { getCoursesQuery } from '../hooks/getCourses'

export function Search() {
    const [searchParams] = useSearchParams()

    const search_param = searchParams.get('search')
    const categories_param = searchParams.get('categories')
    const query_url = `${course_url}/courses/?search=${search_param}${
        categories_param ? `&categories=${categories_param}` : ''
    }`

    const { data, isLoading } = getCoursesQuery({
        search: search_param || undefined,
        categories: categories_param || undefined,
        url: query_url,
    })

    return (
        <div>
            <p>Search: {search_param}</p>
            <br />
            <p>Categories: {categories_param}</p>
            <br />
            <p>Full URL: {query_url}</p>
            <br />

            {isLoading ? (
                <div className="loading">Загрузка курсов...</div>
            ) : data?.data.courses.length ? (
                <>
                    <div className="courses-grid">
                        {data?.data.courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="no-courses">Курсы не найдены</div>
            )}
        </div>
    )
}
