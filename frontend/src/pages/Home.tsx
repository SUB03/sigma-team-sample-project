import { Link } from 'react-router-dom'
<<<<<<< HEAD
=======
import { useCookies } from 'react-cookie'
import { useLogoutMutation } from '../mutations/useLogoutMutation.tsx'
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd
import { useState } from 'react'

import CourseCard from '../components/CourseCard'
import Pagination from '../components/Pagination'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

import {
    getCoursesQuery,
    getPopularCoursesQuery,
} from '../hooks/useCourses.tsx'
import { getCategories } from '../hooks/useCategories.tsx'
import { useAuth } from '../contexts/AuthContext.tsx'

export function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string[]>([])
    const { logout } = useAuth()

    const { data: popularCourses, isLoading: isPopularLoading } =
        getPopularCoursesQuery()
    const { data: allCourses, isLoading: isAllCoursesLoading } =
        getCoursesQuery()

    const { data: categories } = getCategories()
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 12,
    })

    const finalSearchQuery = `/results?search=${searchQuery}${
        selectedCategory.length > 0
            ? `&categories=${selectedCategory.join(',')}`
            : ''
    }`
<<<<<<< HEAD
=======
    console.log(`finalSearchQuery: ${finalSearchQuery}`)
    const logoutMutation = useLogoutMutation()
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd

    const handleSearchInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(e.target.value)
    }

<<<<<<< HEAD
=======
    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await logoutMutation.mutateAsync()
            removeCookie('access_token', { path: '/' })
            removeCookie('refresh_token', { path: '/' })
            logout()
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd
    const handleCategoryChange = (categoryName: string) => {
        if (selectedCategory.includes(categoryName)) {
            setSelectedCategory(
                selectedCategory.filter((c) => c !== categoryName)
            )
        } else {
            setSelectedCategory([...selectedCategory, categoryName])
        }
    }

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, currentPage: page }))
    }

    return (
        <>
            <Header />

            {/* Hero section with search */}
            <section className="hero-bg-animated text-white py-5" style={{
                minHeight: '600px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container text-center" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="mb-4">
                        <span className="badge bg-light text-primary px-4 py-2 mb-3" style={{
                            fontSize: '0.9rem',
                            borderRadius: '50px',
                            backdropFilter: 'blur(10px)',
                            background: 'rgba(255, 255, 255, 0.9)'
                        }}>
                            🚀 Start Your IT Journey Today
                        </span>
                    </div>
                    <h1 className="display-2 fw-bold mb-4 fade-in" style={{
                        textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        letterSpacing: '-0.02em'
                    }}>
                        Learn Programming <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>from Scratch</span>
                    </h1>
                    <div className="row justify-content-center fade-in-scale mb-4" style={{ animationDelay: '0.2s' }}>
                        <div className="col-lg-7">
                            <div className="input-group input-group-lg shadow-lg" style={{
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                background: 'white'
                            }}>
                                <input
                                    type="text"
                                    className="form-control border-0"
                                    placeholder="Search for courses by languages, technologies..."
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    style={{
                                        padding: '1.2rem 1.5rem',
                                        fontSize: '1.1rem'
                                    }}
                                />
                                <Link to={finalSearchQuery} className="btn btn-warning fw-bold border-0" style={{
                                    padding: '1.2rem 2.5rem',
                                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                    fontSize: '1.1rem'
                                }}>
                                    🔍 Find Courses
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-4 fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="text-center">
                            <h3 className="fw-bold mb-1">1000+</h3>
                            <p className="mb-0 small">Courses</p>
                        </div>
                        <div className="text-center">
                            <h3 className="fw-bold mb-1">50K+</h3>
                            <p className="mb-0 small">Students</p>
                        </div>
                        <div className="text-center">
                            <h3 className="fw-bold mb-1">4.8★</h3>
                            <p className="mb-0 small">Average Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course categories */}
            <section className="py-5" style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="mb-3" style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: '2.5rem',
                            fontWeight: '800'
                        }}>📚 Popular Categories</h2>
                        <p className="text-muted">Choose from our wide range of programming courses</p>
                    </div>
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        {categories?.data.categories.map((category) => (
                            <button
                                key={category}
                                className={`btn ${selectedCategory.includes(category) ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-4 py-2`}
                                onClick={() => handleCategoryChange(category)}
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular courses */}
            <section className="py-5">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div>
                            <h2 className="mb-2" style={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontSize: '2.5rem',
                                fontWeight: '800'
                            }}>🔥 Most Popular Courses</h2>
                            <p className="text-muted mb-0">Trending courses this month</p>
                        </div>
                        <Link to="/results" className="btn btn-outline-primary rounded-pill px-4">
                            All Courses →
                        </Link>
                    </div>
                    {isPopularLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : popularCourses?.data.courses.length ? (
                        <div className="row g-4">
                            {popularCourses.data.courses.slice(0, 3).map((course) => (
                                <div key={course.id} className="col-lg-4 col-md-6">
                                    <CourseCard
                                        course={course}
                                        isPopular={true}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-info">No popular courses</div>
                    )}
                </div>
            </section>

            {/* All courses */}
            <section className="py-5" style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 style={{
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: '2.5rem',
                            fontWeight: '800'
                        }}>All Programming Courses</h2>
                        <p className="text-muted">Explore our complete collection</p>
                    </div>
                    
                    {isAllCoursesLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : allCourses?.data.courses.length ? (
                        <>
                            <div className="row g-4">
                                {allCourses.data.courses.map((course) => (
                                    <div key={course.id} className="col-lg-3 col-md-6">
                                        <CourseCard course={course} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5">
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="alert alert-warning">No courses found</div>
                    )}
                </div>
            </section>

            {/* Benefits */}
            <section className="py-5 mb-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: '2.5rem',
                            fontWeight: '800'
                        }}>Why Choose Us?</h2>
                        <p className="text-muted">Everything you need to succeed in programming</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-3 col-md-6 text-center fade-in-scale">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="mb-3 d-inline-block p-3 rounded-circle" style={{ 
                                        fontSize: '3rem',
                                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                                    }}>🎯</div>
                                    <h3 className="h5 fw-bold mb-3">Practice-Oriented</h3>
                                    <p className="text-muted mb-0">Real projects in every course to build your portfolio</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center fade-in-scale" style={{ animationDelay: '0.1s' }}>
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="mb-3 d-inline-block p-3 rounded-circle" style={{ 
                                        fontSize: '3rem',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    }}>👨‍🏫</div>
                                    <h3 className="h5 fw-bold mb-3">Expert Mentors</h3>
                                    <p className="text-muted mb-0">Support from experienced developers whenever you need</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center fade-in-scale" style={{ animationDelay: '0.2s' }}>
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="mb-3 d-inline-block p-3 rounded-circle" style={{ 
                                        fontSize: '3rem',
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                                    }}>📱</div>
                                    <h3 className="h5 fw-bold mb-3">Full Accessibility</h3>
                                    <p className="text-muted mb-0">Learn from any device, anywhere, anytime</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 text-center fade-in-scale" style={{ animationDelay: '0.3s' }}>
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="mb-3 d-inline-block p-3 rounded-circle" style={{ 
                                        fontSize: '3rem',
                                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                                    }}>💼</div>
                                    <h3 className="h5 fw-bold mb-3">Career Support</h3>
                                    <p className="text-muted mb-0">Job placement assistance and career guidance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}
