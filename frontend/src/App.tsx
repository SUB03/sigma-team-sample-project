import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CookiesProvider } from 'react-cookie'
import { HashRouter, Routes, Route } from 'react-router-dom'

import ProtectedRoute from './routeComponents/ProtectedRoute'
import PublicRoute from './routeComponents/PublicRoute'

import { Home } from './pages/Home'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { UserSettings } from './pages/UserSettings'
import { UserProfile } from './pages/UserProfile'
import { AuthProvider } from './components/AuthProvider'

const queryClient = new QueryClient()

function App() {
    return (
        <CookiesProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <HashRouter>
                        <Routes>
                            {/* public routes */}
                            <Route path="/" element={<Home />} />

                            {/* if user is unauthentificated they cannot access these */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/user" element={<UserProfile />} />
                                <Route
                                    path="/user/settings"
                                    element={<UserSettings />}
                                />
                            </Route>

                            {/* if user is authentificated they cannot access these */}
                            <Route element={<PublicRoute />}>
                                <Route path="/sign_in" element={<SignIn />} />
                                <Route path="/sign_up" element={<SignUp />} />
                            </Route>
                        </Routes>
                    </HashRouter>
                </AuthProvider>
            </QueryClientProvider>
        </CookiesProvider>
    )
}

export default App
