import { useSearchParams } from 'react-router-dom'
import { course_url } from '../api'
import CourseCard from '../components/CourseCard'
import { getCoursesQuery } from '../hooks/useCourses'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

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
        <>
            <Header />
            <div className="min-vh-100" style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
                paddingTop: '3rem',
                paddingBottom: '3rem'
            }}>
                <div className="container">
                    {/* Search Info Section */}
                    <div className="card border-0 mb-4" style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <span style={{ fontSize: '2rem' }}>🔍</span>
                            <h2 className="mb-0" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontWeight: 'bold'
                            }}>Search Results</h2>
                        </div>
                        
                        {search_param && (
                            <p className="mb-2">
                                <span className="fw-semibold text-muted">Search:</span>{' '}
                                <span className="badge" style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontSize: '0.9rem',
                                    padding: '0.5rem 1rem'
                                }}>{search_param}</span>
                            </p>
                        )}
                        
                        {categories_param && (
                            <p className="mb-2">
                                <span className="fw-semibold text-muted">Categories:</span>{' '}
                                <span className="badge bg-secondary" style={{
                                    fontSize: '0.9rem',
                                    padding: '0.5rem 1rem'
                                }}>{categories_param}</span>
                            </p>
                        )}
                        
                        {data?.data.courses && (
                            <p className="mb-0 mt-3 text-muted">
                                Found <strong>{data.data.courses.length}</strong> course{data.data.courses.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Results Section */}
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{
                                width: '3rem',
                                height: '3rem',
                                color: '#667eea'
                            }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted fw-semibold">Loading courses...</p>
                        </div>
                    ) : data?.data.courses.length ? (
                        <div className="row g-4">
                            {data?.data.courses.map((course) => (
                                <div key={course.id} className="col-lg-4 col-md-6">
                                    <CourseCard course={course} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div style={{
                                fontSize: '5rem',
                                marginBottom: '1rem'
                            }}>😔</div>
                            <h3 className="text-muted mb-3">No courses found</h3>
                            <p className="text-muted">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}
