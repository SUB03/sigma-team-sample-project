import '../CSS/Home.css'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useCookies } from 'react-cookie'
import { useLogout } from '../mutations/logoutMutation'
import { useState } from 'react'

import CourseCard from '../components/CourseCard' // Предполагаемый компонент
import Pagination from '../components/Pagination' // Предполагаемый компонент

import {
    getCoursesQuery,
    getPopularCoursesQuery,
} from '../hooks/getCourses.tsx'
import { getCategories } from '../hooks/getCategories.tsx'

export function Home() {
    const [cookie, , removeCookie] = useCookies([
        'access_token',
        'refresh_token',
    ])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string[]>([])

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

    const logged_in = cookie.access_token
    const destination = logged_in ? '/user' : '/sign_in'
    const user_button = logged_in ? 'Go to Profile' : 'Authorization'
    const finalSearchQuery = `results/?search=${searchQuery}${
        selectedCategory.length > 0
            ? `&categories=${selectedCategory.join(',')}`
            : ''
    }`
    console.log(`finalSearchQuery: ${finalSearchQuery}`)
    const logoutMutation = useLogout()

    const handleSearchInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(e.target.value)
    }

    const handleLogout = async (e: React.FormEvent) => {
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
                <form onSubmit={handleLogout}>
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
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                    <Link to={finalSearchQuery}>
                        <button>Найти</button>
                    </Link>
                </div>
            </section>

            {/* Категории курсов  */}
            <section className="categories">
                <h2>Категории</h2>
                <div className="category-list">
                    {categories?.data.categories.map((category) => (
                        <button
                            key={category}
                            className={`category-btn${
                                selectedCategory.includes(category)
                                    ? ' selected'
                                    : ''
                            }`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Популярные курсы */}
            <section className="popular-courses">
                <h2>🔥 Самые популярные курсы</h2>
                {isPopularLoading ? (
                    <div className="loading">Загрузка популярных курсов...</div>
                ) : popularCourses?.data.courses.length ? (
                    <div className="courses-grid">
                        {popularCourses.data.courses.map((course) => (
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
                {isAllCoursesLoading ? (
                    <div className="loading">Загрузка курсов...</div>
                ) : allCourses?.data.courses.length ? (
                    <>
                        <div className="courses-grid">
                            {allCourses.data.courses.map((course) => (
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
        </>
    )
}
