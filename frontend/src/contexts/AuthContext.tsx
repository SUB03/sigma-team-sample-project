import { createContext, useContext } from 'react'
import z from 'zod'

export interface AuthData {
    access?: boolean
}

const AuthContextSchema = z.object({
    access: z.boolean(),
})

export const AuthContext = createContext<AuthData | undefined>(undefined)

export function useAuthContext() {
    const data = AuthContextSchema.safeParse(useContext(AuthContext))

    if (data.success) {
        return data.data.access
        // Proceed with your logic
    } else {
        // Handle the error (e.g., context is undefined or invalid)
        console.error('Invalid AuthContext:', data.error)
    }
}
