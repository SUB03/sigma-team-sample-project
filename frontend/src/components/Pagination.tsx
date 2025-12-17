// components/Pagination.tsx
import { useState, useEffect } from 'react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    maxVisiblePages?: number
    showFirstLast?: boolean
    showPrevNext?: boolean
}

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 5,
    showFirstLast = true,
    showPrevNext = true,
}: PaginationProps) {
    const [pages, setPages] = useState<number[]>([])

    // Генерация списка страниц для отображения
    useEffect(() => {
        const generatePages = () => {
            if (totalPages <= maxVisiblePages) {
                return Array.from({ length: totalPages }, (_, i) => i + 1)
            }

            let start = Math.max(
                1,
                currentPage - Math.floor(maxVisiblePages / 2)
            )
            let end = start + maxVisiblePages - 1

            if (end > totalPages) {
                end = totalPages
                start = Math.max(1, end - maxVisiblePages + 1)
            }

            const pageList = []
            for (let i = start; i <= end; i++) {
                pageList.push(i)
            }

            return pageList
        }

        setPages(generatePages())
    }, [currentPage, totalPages, maxVisiblePages])

    // Обработчики кликов
    const handlePageClick = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page)
        }
    }

    const handleFirstClick = () => handlePageClick(1)
    const handleLastClick = () => handlePageClick(totalPages)
    const handlePrevClick = () => handlePageClick(currentPage - 1)
    const handleNextClick = () => handlePageClick(currentPage + 1)

    if (totalPages <= 1) return null

    return (
        <div>
            <nav aria-label="Навигация по страницам">
                <ul>
                    {/* Первая страница */}
                    {showFirstLast &&
                        totalPages > maxVisiblePages &&
                        currentPage > 1 && (
                            <li>
                                <button
                                    onClick={handleFirstClick}
                                    aria-label="Первая страница"
                                    disabled={currentPage === 1}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                    >
                                        <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
                                    </svg>
                                    <span>Первая</span>
                                </button>
                            </li>
                        )}

                    {/* Предыдущая страница */}
                    {showPrevNext && (
                        <li>
                            <button
                                onClick={handlePrevClick}
                                aria-label="Предыдущая страница"
                                disabled={currentPage === 1}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
                                </svg>
                                <span>Назад</span>
                            </button>
                        </li>
                    )}

                    {/* Многоточие в начале */}
                    {pages[0] > 1 && (
                        <li>
                            <span>...</span>
                        </li>
                    )}

                    {/* Номера страниц */}
                    {pages.map((page) => (
                        <li key={page}>
                            <button
                                onClick={() => handlePageClick(page)}
                                aria-label={`Страница ${page}`}
                                aria-current={
                                    page === currentPage ? 'page' : undefined
                                }
                            >
                                {page}
                            </button>
                        </li>
                    ))}

                    {/* Многоточие в конце */}
                    {pages[pages.length - 1] < totalPages && (
                        <li>
                            <span>...</span>
                        </li>
                    )}

                    {/* Следующая страница */}
                    {showPrevNext && (
                        <li>
                            <button
                                onClick={handleNextClick}
                                aria-label="Следующая страница"
                                disabled={currentPage === totalPages}
                            >
                                <span>Далее</span>
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                                </svg>
                            </button>
                        </li>
                    )}

                    {/* Последняя страница */}
                    {showFirstLast &&
                        totalPages > maxVisiblePages &&
                        currentPage < totalPages && (
                            <li>
                                <button
                                    onClick={handleLastClick}
                                    aria-label="Последняя страница"
                                    disabled={currentPage === totalPages}
                                >
                                    <span>Последняя</span>
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                    >
                                        <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM18 6h2v12h-2z" />
                                    </svg>
                                </button>
                            </li>
                        )}
                </ul>

                {/* Показ информации о текущей странице */}
                <div>
                    <span>
                        Страница <strong>{currentPage}</strong> из{' '}
                        <strong>{totalPages}</strong>
                    </span>
                    <div>
                        <label htmlFor="page-input">Перейти:</label>
                        <input
                            id="page-input"
                            type="number"
                            min="1"
                            max={totalPages}
                            defaultValue={currentPage}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const page = parseInt(
                                        (e.target as HTMLInputElement).value
                                    )
                                    if (page >= 1 && page <= totalPages) {
                                        handlePageClick(page)
                                    }
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                const input = document.getElementById(
                                    'page-input'
                                ) as HTMLInputElement
                                const page = parseInt(input.value)
                                if (page >= 1 && page <= totalPages) {
                                    handlePageClick(page)
                                }
                            }}
                        >
                            →
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Pagination
