export interface UserSignUpData {
    username: string
    email: string
    password: string
}

export interface UserSignInData {
    username: string // email or login
    password: string
}

export interface AuthResponse {
    access: string
    refresh: string
    message?: string
    user?: {
        id: number
        username: string
        email: string
    }
}

export interface RefreshResponse {
    access: string
    refresh: string
}
