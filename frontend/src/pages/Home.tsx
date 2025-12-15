import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useCookies } from 'react-cookie'
import { useLogout } from '../mutations/logoutMutation'
import { useEffect, useState } from 'react'

import CourseCard from '../components/CourseCard' // Предполагаемый компонент
import Pagination from '../components/Pagination' // Предполагаемый компонент
import type {
    CourseData,
    //PopularCoursesData,
} from '../types/course.tsx'
import { $api, course_url } from '../api.ts'

export function Home() {
    const [cookie, , removeCookie] = useCookies([
        'access_token',
        'refresh_token',
    ])

    const [popularCourses, setPopularCourses] = useState<CourseData[]>([])
    const [allCourses, setAllCourses] = useState<CourseData[]>([])
    const [loading, setLoading] = useState({ popular: true, all: true })
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 12,
    })

    const logged_in = cookie.access_token
    const destination = logged_in ? '/user' : '/sign_in'
    const user_button = logged_in ? 'Go to Profile' : 'Authorization'
    const logoutMutation = useLogout()

    // TODO: use ReactQuery
    useEffect(() => {
        const fetchPopularCourses = async () => {
            try {
                const config: any = {
                    headers: {
                        'Content-Type': 'application/json', // Example: Set content type
                    },
                }
                config.skipAuth = true
                const response = await $api.get(
                    `${course_url}/courses/popular/`,
                    config
                )
                console.log(response)
                setPopularCourses(response.data.courses)
            } catch (error) {
                console.error('Error fetching popular courses:', error)
            } finally {
                setLoading((prev) => ({ ...prev, popular: false }))
            }
        }

        fetchPopularCourses()
    }, [])

    // Загрузка всех курсов с пагинацией
    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const config: any = {
                    headers: {
                        'Content-Type': 'application/json', // Example: Set content type
                    },
                }
                config.skipAuth = true
                const response = await $api.get(
                    `${course_url}/courses/`,
                    config
                )

                setAllCourses(response.data.courses)
                setPagination((prev) => ({
                    ...prev,
                    totalPages: 10, //response.data.totalPages
                }))
            } catch (error) {
                console.error('Error fetching all courses:', error)
            } finally {
                setLoading((prev) => ({ ...prev, all: false }))
            }
        }

        fetchAllCourses()
    }, [cookie.access_token, pagination.currentPage])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const status = await logoutMutation.mutateAsync()
            if (status === 205) {
                removeCookie('access_token', { path: '/' })
                removeCookie('refresh_token', { path: '/' })
            }
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, currentPage: page }))
    }
    //#region  HTML
    return (
        <>
            <div className="header-section">
                <Link to={destination}>
                    <Button
                        onClick={() =>
                            console.log(`redirected to ${destination}`)
                        }
                    >
                        {user_button}
                    </Button>
                </Link>
                <form onSubmit={handleSubmit}>
                    {logged_in && (
                        <button
                            type="submit"
                            disabled={logoutMutation.isPending}
                        >
                            {logoutMutation.isPending
                                ? 'logging out...'
                                : 'logout'}
                        </button>
                    )}
                </form>
            </div>

            {/* Hero секция с поиском */}
            <section className="hero">
                <h1>Изучайте программирование с нуля</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Поиск курсов по языкам, технологиям..."
                    />
                    <button>Найти</button>
                </div>
            </section>

            {/* Категории курсов */}
            <section className="categories">
                <h2>Категории</h2>
                <div className="category-list">
                    {[
                        'Frontend',
                        'Backend',
                        'Mobile',
                        'Data Science',
                        'DevOps',
                        'Game Dev',
                    ].map((category) => (
                        <button key={category} className="category-btn">
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Популярные курсы */}
            <section className="popular-courses">
                <h2>🔥 Самые популярные курсы</h2>
                {loading.popular ? (
                    <div className="loading">Загрузка популярных курсов...</div>
                ) : popularCourses.length > 0 ? (
                    <div className="courses-grid">
                        {popularCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isPopular={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="no-courses">Нет популярных курсов</div>
                )}
            </section>

            {/* Фильтры */}
            <section className="filters">
                <select>
                    <option value="">Все языки</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                </select>
                <select>
                    <option value="">Все уровни</option>
                    <option value="beginner">Начинающий</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                </select>
                <button className="filter-btn">Применить фильтры</button>
            </section>

            {/* Все курсы */}
            <section className="all-courses">
                <h2>Все курсы по программированию</h2>
                {loading.all ? (
                    <div className="loading">Загрузка курсов...</div>
                ) : allCourses.length > 0 ? (
                    <>
                        <div className="courses-grid">
                            {allCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="no-courses">Курсы не найдены</div>
                )}
            </section>

            {/* Дополнительные секции */}
            <section className="features">
                <h2>Почему выбирают нас?</h2>
                <div className="features-grid">
                    <div className="feature">
                        <h3>🎯 Практика</h3>
                        <p>Реальные проекты в каждом курсе</p>
                    </div>
                    <div className="feature">
                        <h3>👨‍🏫 Наставники</h3>
                        <p>Поддержка опытных разработчиков</p>
                    </div>
                    <div className="feature">
                        <h3>📱 Доступность</h3>
                        <p>Учитесь с любого устройства</p>
                    </div>
                    <div className="feature">
                        <h3>💼 Карьера</h3>
                        <p>Помощь с трудоустройством</p>
                    </div>
                </div>
            </section>

            <style>{`
                .header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 2rem;
                    background: #f8f9fa;
                }

                .hero {
                    text-align: center;
                    padding: 3rem 1rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .hero h1 {
                    font-size: 2.5rem;
                    margin-bottom: 2rem;
                }

                .search-bar {
                    max-width: 600px;
                    margin: 0 auto;
                    display: flex;
                    gap: 0.5rem;
                }

                .search-bar input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                }

                .search-bar button {
                    padding: 0.75rem 2rem;
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .categories {
                    padding: 2rem;
                }

                .category-list {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-top: 1rem;
                }

                .category-btn {
                    padding: 0.5rem 1.5rem;
                    background: #e9ecef;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .category-btn:hover {
                    background: #dee2e6;
                }

                .popular-courses,
                .all-courses {
                    padding: 2rem;
                }

                .courses-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                }

                .filters {
                    padding: 1rem 2rem;
                    display: flex;
                    gap: 1rem;
                    background: #f8f9fa;
                }

                .filters select {
                    padding: 0.5rem 1rem;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                }

                .filter-btn {
                    padding: 0.5rem 1.5rem;
                    background: #4dabf7;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .features {
                    padding: 3rem 2rem;
                    background: #f8f9fa;
                    text-align: center;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-top: 2rem;
                }

                .feature {
                    padding: 1.5rem;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .loading {
                    text-align: center;
                    padding: 2rem;
                    color: #6c757d;
                }

                .no-courses {
                    text-align: center;
                    padding: 2rem;
                    color: #6c757d;
                }
            `}</style>
        </>
    )
}
