import { useState, useEffect } from 'react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
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
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page)
        }
    }

    if (totalPages <= 1) return null

    return (
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
                            </li>
                        )}
                    </>
                )}

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

