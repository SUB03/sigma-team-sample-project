import { useState, useEffect } from 'react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange?: (page: number) => void
    maxVisiblePages?: number
}

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 5,
}: PaginationProps) {
    const [pages, setPages] = useState<number[]>([])

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

    const handlePageClick = (page: number) => {
<<<<<<< HEAD
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page)
=======
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange && onPageChange(page)
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd
        }
    }

    if (totalPages <= 1) return null

    return (
<<<<<<< HEAD
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center" style={{ gap: '0.5rem' }}>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                            borderRadius: '10px',
                            border: '2px solid #e0e0e0',
                            padding: '0.5rem 1rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            background: currentPage === 1 ? '#f5f5f5' : 'white'
                        }}
                    >
                        ← Back
                    </button>
                </li>

                {pages[0] > 1 && (
                    <>
                        <li className="page-item">
                            <button 
                                className="page-link" 
                                onClick={() => handlePageClick(1)}
                                style={{
                                    borderRadius: '10px',
                                    border: '2px solid #e0e0e0',
                                    padding: '0.5rem 1rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                1
                            </button>
                        </li>
                        {pages[0] > 2 && (
                            <li className="page-item disabled">
                                <span className="page-link" style={{
                                    border: 'none',
                                    background: 'transparent'
                                }}>...</span>
=======
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
                                    <span>Первая</span>
                                </button>
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd
                            </li>
                        )}
                    </>
                )}

<<<<<<< HEAD
                {pages.map((page) => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={() => handlePageClick(page)}
                            style={{
                                borderRadius: '10px',
                                border: page === currentPage ? 'none' : '2px solid #e0e0e0',
                                padding: '0.5rem 1rem',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                background: page === currentPage 
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                    : 'white',
                                color: page === currentPage ? 'white' : '#333',
                                boxShadow: page === currentPage 
                                    ? '0 4px 15px rgba(102, 126, 234, 0.3)' 
                                    : 'none'
=======
                    {/* Предыдущая страница */}
                    {showPrevNext && (
                        <li>
                            <button
                                onClick={handlePrevClick}
                                aria-label="Предыдущая страница"
                                disabled={currentPage === 1}
                            >
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
>>>>>>> 5dce28cffee02be356f0b62e36bdafa10a5303fd
                            }}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {pages[pages.length - 1] < totalPages && (
                    <>
                        {pages[pages.length - 1] < totalPages - 1 && (
                            <li className="page-item disabled">
                                <span className="page-link" style={{
                                    border: 'none',
                                    background: 'transparent'
                                }}>...</span>
                            </li>
                        )}
                        <li className="page-item">
                            <button 
                                className="page-link" 
                                onClick={() => handlePageClick(totalPages)}
                                style={{
                                    borderRadius: '10px',
                                    border: '2px solid #e0e0e0',
                                    padding: '0.5rem 1rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {totalPages}
                            </button>
                        </li>
                    </>
                )}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                            borderRadius: '10px',
                            border: '2px solid #e0e0e0',
                            padding: '0.5rem 1rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            background: currentPage === totalPages ? '#f5f5f5' : 'white'
                        }}
                    >
                        Next →
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination

