// components/CourseCard.tsx
import { Link } from 'react-router-dom'
import type { CourseData } from '../types/coursesData'

interface CourseCardProps {
    course: CourseData
    isPopular?: boolean
    onClick?: () => void
}

function CourseCard({ course, isPopular = false }: CourseCardProps) {
    const {
        id,
        title,
        description,
        popularity,
        difficulty_level,
        duration_hours,
        price,
        updated_at,
    } = course

    // Форматирование цены
    const formatPrice = (price: number | undefined) => {
        if (price === undefined || price === 0) return 'Бесплатно'
        if (price === -1) return 'По подписке'
        return `${price.toLocaleString()} ₽`
    }

    // Рендер рейтинга звездами
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        return (
            <div>
                {[...Array(5)].map((_, index) => {
                    if (index < fullStars) {
                        return <span key={index}>★</span>
                    } else if (index === fullStars && hasHalfStar) {
                        return <span key={index}>★</span>
                    }
                    return <span key={index}>★</span>
                })}
            </div>
        )
    }

    // Получение цвета для уровня сложности
    const getLevelColor = (level: string) => {
        const colors: Record<string, string> = {
            Начальный: '#4CAF50',
            Средний: '#FF9800',
            Продвинутый: '#F44336',
            Эксперт: '#9C27B0',
        }
        return colors[level] || '#757575'
    }

    // Форматирование продолжительности
    const formatDuration = (hours: number) => {
        if (hours < 1) return 'Менее часа'
        if (hours < 24) return `${hours} ч`
        const days = Math.floor(hours / 24)
        const remainingHours = hours % 24
        if (remainingHours === 0) return `${days} дн`
        return `${days} дн ${remainingHours} ч`
    }

    return (
        <div>
            {/* Бейдж для популярных курсов */}
            {isPopular && (
                <div>
                    <span>🔥</span> Популярный
                </div>
            )}

            {/* Бейдж для премиум курсов */}
            {price && price > 0 && (
                <div>
                    <span>👑</span> Премиум
                </div>
            )}

            {/* Изображение курса */}
            <div>
                {/* <img
                    src={imageUrl || '/default-course.jpg'}
                    alt={title}
                    loading="lazy"
                /> */}

                <div>
                    <span>👥 {0}</span>
                    <span>⏱️ {formatDuration(duration_hours || 0)}</span>
                </div>
            </div>

            {/* Контент карточки */}
            <div>
                {/* Заголовок курса */}
                <Link to={`/courses/${id}`}>
                    <h3>{title}</h3>
                </Link>

                {/* Краткое описание */}
                <p>
                    {description.length > 100
                        ? `${description.substring(0, 100)}...`
                        : description}
                </p>

                {/* Теги курса */}
                {/* {tags.length > 0 && (
                    <div >
                        {tags.slice(0, 3).map((tag: any, index: any) => (
                            <span key={index}>
                                {tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span>+{tags.length - 3}</span>
                        )}
                    </div>
                )} */}

                {/* Уровень сложности */}
                {difficulty_level && (
                    <div>
                        <span
                            style={{
                                backgroundColor:
                                    getLevelColor(difficulty_level),
                            }}
                        >
                            {difficulty_level}
                        </span>
                        {/* <span>
                            {completionRate
                                ? `Завершили: ${completionRate}%`
                                : 'Новый курс'}
                        </span> */}
                    </div>
                )}

                {/* Рейтинг и отзывы */}
                {popularity !== undefined && (
                    <div>
                        {renderStars(popularity)}
                        <span>{popularity.toFixed(1)}</span>
                        {/* {reviewsCount !== undefined && (
                            <span>
                                ({reviewsCount.toLocaleString()})
                            </span>
                        )} */}
                    </div>
                )}

                {/* Информация о цене и действиях */}
                <div>
                    <div>
                        <span>{formatPrice(price)}</span>
                        {price && price > 0 && (
                            <span>{formatPrice(price! * 1.5)}</span>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                // Здесь будет логика добавления в избранное
                            }}
                            aria-label="Добавить в избранное"
                        >
                            ♡
                        </button>
                        <Link to={`/courses/${id}`}>Подробнее</Link>
                    </div>
                </div>

                {/* Дополнительная информация */}
                <div>
                    {updated_at && (
                        <span>
                            📅 Обновлен:{' '}
                            {new Date(updated_at).toLocaleDateString('ru-RU')}
                        </span>
                    )}
                    <span>
                        📊 Практических заданий: {course.duration_hours || 12}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CourseCard
