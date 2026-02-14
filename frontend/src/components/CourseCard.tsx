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

    const formatPrice = (price: number | undefined) => {
        if (price === undefined || price === 0) return 'Free'
        if (price === -1) return 'Subscription'
        return `€${price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const getLevelColor = (level: string) => {
        const colors: Record<string, string> = {
            'Beginner': 'success',
            'Intermediate': 'warning',
            'Advanced': 'danger',
            'Expert': 'info',
        }
        return colors[level] || 'secondary'
    }

    const formatDuration = (hours: number) => {
        if (hours < 1) return 'Less than 1 hour'
        if (hours < 24) return `${hours} h`
        const days = Math.floor(hours / 24)
        const remainingHours = hours % 24
        if (remainingHours === 0) return `${days} d`
        return `${days} d ${remainingHours} h`
    }

    return (
        <div className="card h-100 shadow-sm border-0 hover-lift" style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            {/* Badges */}
            <div className="position-relative">
                {isPopular && (
                    <span className="position-absolute top-0 start-0 m-3 badge text-white px-3 py-2" style={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        borderRadius: '50px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(245, 87, 108, 0.4)',
                        zIndex: 10
                    }}>
                        🔥 Popular
                    </span>
                )}
                {price && price > 0 && (
                    <span className="position-absolute top-0 end-0 m-3 badge text-dark px-3 py-2" style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        borderRadius: '50px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)',
                        zIndex: 10
                    }}>
                        👑 Premium
                    </span>
                )}
                
                {/* Image placeholder */}
                <div className="text-white d-flex align-items-center justify-content-center" 
                     style={{ 
                         height: '220px',
                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                         position: 'relative',
                         overflow: 'hidden'
                     }}>
                    <div className="position-absolute" style={{
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        animation: 'rotate 20s linear infinite'
                    }}></div>
                    <div className="text-center position-relative" style={{ zIndex: 5 }}>
                        <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>📚</div>
                        <small className="d-block mt-2 fw-bold" style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            fontSize: '0.9rem'
                        }}>
                            <span className="me-3">⏱️ {formatDuration(duration_hours || 0)}</span>
                        </small>
                    </div>
                </div>
            </div>

            {/* Card content */}
            <div className="card-body d-flex flex-column p-4">
                {/* Course title */}
                <Link to={`/courses/${id}`} className="text-decoration-none">
                    <h5 className="card-title text-dark mb-3 fw-bold" style={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontSize: '1.1rem',
                        lineHeight: '1.4',
                        transition: 'color 0.3s ease'
                    }}>
                        {title}
                    </h5>
                </Link>

                {/* Short description */}
                <p className="card-text text-muted small flex-grow-1 mb-3" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.6'
                }}>
                    {description}
                </p>

                {/* Difficulty level */}
                {difficulty_level && (
                    <div className="mb-3">
                        <span className={`badge bg-${getLevelColor(difficulty_level)} px-3 py-2`} style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            borderRadius: '6px'
                        }}>
                            {difficulty_level}
                        </span>
                    </div>
                )}

                {/* Students enrolled */}
                {popularity !== undefined && popularity > 0 && (
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <span style={{ fontSize: '1.2rem' }}>👥</span>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                            <span className="fw-bold text-dark">{popularity.toLocaleString()}</span> students
                        </span>
                    </div>
                )}

                {/* Price and action information */}
                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <div>
                        <div className="fw-bold" style={{ 
                            fontSize: '1.5rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {formatPrice(price)}
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm border-0"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            aria-label="Add to favorites"
                            style={{
                                fontSize: '1.3rem',
                                color: '#ef4444',
                                transition: 'transform 0.2s ease',
                                background: 'transparent'
                            }}
                        >
                            ♡
                        </button>
                        <Link to={`/courses/${id}`} className="btn btn-sm btn-primary px-4" style={{
                            borderRadius: '8px',
                            fontWeight: '600'
                        }}>
                            Details
                        </Link>
                    </div>
                </div>

                {/* Additional information */}
                {updated_at && (
                    <div className="mt-3 small text-muted d-flex align-items-center gap-1">
                        📅 Updated: {new Date(updated_at).toLocaleDateString('en-US')}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CourseCard

