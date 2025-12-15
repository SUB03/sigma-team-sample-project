// components/CourseCard.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import type { CourseData } from '../types/course'
import '../csss/CourseCard.css'

interface CourseCardProps {
    course: CourseData
    isPopular?: boolean
    onClick?: () => void
}

const CourseCard: React.FC<CourseCardProps> = ({
    course,
    isPopular = false,
    onClick,
}) => {
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
            <div className="stars">
                {[...Array(5)].map((_, index) => {
                    if (index < fullStars) {
                        return (
                            <span key={index} className="star full">
                                ★
                            </span>
                        )
                    } else if (index === fullStars && hasHalfStar) {
                        return (
                            <span key={index} className="star half">
                                ★
                            </span>
                        )
                    }
                    return (
                        <span key={index} className="star empty">
                            ★
                        </span>
                    )
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
                <div className="popular-badge">
                    <span className="fire-icon">🔥</span> Популярный
                </div>
            )}

            {/* Бейдж для премиум курсов */}
            {price && price > 0 && (
                <div className="premium-badge">
                    <span className="crown-icon">👑</span> Премиум
                </div>
            )}

            {/* Изображение курса */}
            <div className="course-image-container">
                {/* <img
                    src={imageUrl || '/default-course.jpg'}
                    alt={title}
                    className="course-image"
                    loading="lazy"
                /> */}
                <div className="image-overlay">
                    <button
                        className="quick-view-btn"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (onClick) onClick()
                        }}
                    >
                        Быстрый просмотр
                    </button>
                </div>
                <div className="course-stats">
                    <span className="stat">👥 {0}</span>
                    <span className="stat">
                        ⏱️ {formatDuration(duration_hours || 0)}
                    </span>
                </div>
            </div>

            {/* Контент карточки */}
            <div className="course-content">
                {/* Заголовок курса */}
                <Link to={`/courses/${id}`} className="course-title-link">
                    <h3 className="course-title">{title}</h3>
                </Link>

                {/* Краткое описание */}
                <p className="course-description">
                    {description.length > 100
                        ? `${description.substring(0, 100)}...`
                        : description}
                </p>

                {/* Теги курса */}
                {/* {tags.length > 0 && (
                    <div className="course-tags">
                        {tags.slice(0, 3).map((tag: any, index: any) => (
                            <span key={index} className="tag">
                                {tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span className="tag more">+{tags.length - 3}</span>
                        )}
                    </div>
                )} */}

                {/* Уровень сложности */}
                {difficulty_level && (
                    <div className="course-level">
                        <span
                            className="level-badge"
                            style={{
                                backgroundColor:
                                    getLevelColor(difficulty_level),
                            }}
                        >
                            {difficulty_level}
                        </span>
                        {/* <span className="completion-rate">
                            {completionRate
                                ? `Завершили: ${completionRate}%`
                                : 'Новый курс'}
                        </span> */}
                    </div>
                )}

                {/* Рейтинг и отзывы */}
                {popularity !== undefined && (
                    <div className="course-rating">
                        {renderStars(popularity)}
                        <span className="rating-value">
                            {popularity.toFixed(1)}
                        </span>
                        {/* {reviewsCount !== undefined && (
                            <span className="reviews-count">
                                ({reviewsCount.toLocaleString()})
                            </span>
                        )} */}
                    </div>
                )}

                {/* Информация о цене и действиях */}
                <div className="course-footer">
                    <div className="price-info">
                        <span className="price">{formatPrice(price)}</span>
                        {price && price > 0 && (
                            <span className="old-price">
                                {formatPrice(price! * 1.5)}
                            </span>
                        )}
                    </div>
                    <div className="course-actions">
                        <button
                            className="favorite-btn"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                // Здесь будет логика добавления в избранное
                            }}
                            aria-label="Добавить в избранное"
                        >
                            ♡
                        </button>
                        <Link to={`/courses/${id}`} className="details-btn">
                            Подробнее
                        </Link>
                    </div>
                </div>

                {/* Дополнительная информация */}
                <div className="course-meta">
                    {updated_at && (
                        <span className="meta-item">
                            📅 Обновлен:{' '}
                            {new Date(updated_at).toLocaleDateString('ru-RU')}
                        </span>
                    )}
                    <span className="meta-item">
                        📊 Практических заданий: {course.duration_hours || 12}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CourseCard
