export interface AllCoursesResponse {
    courses: CourseData[]
    total: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
}

export interface PopularCoursesData {
    count: number
    courses: CourseData[]
}

export interface CourseData {
    id: number
    title: string
    description: string
    created_at: string
    updated_at: string
    price: number
    quantity: number
    popularity: number
    is_limited: boolean
    difficulty_level: string
    duration_hours: number
    category: string
}

export interface review {
    id: number
    course_id: number
    user_id: number
    rating: number
    comment: string
    created_at: string
}
export interface CourseReviews {
    count: number
    total_pages: number
    current_page: number
    page_size: number
    results: review[]
}
