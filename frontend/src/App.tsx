import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CookiesProvider } from 'react-cookie'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ProtectedRoute from './routeComponents/ProtectedRoute'
import PublicRoute from './routeComponents/PublicRoute'

import { Home } from './pages/Home'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { UserSettings } from './pages/UserSettings'
import { UserProfile } from './pages/UserProfile'
import { AuthProvider } from './components/AuthProvider'
import { Search } from './pages/Search'
import { CoursePage } from './pages/CoursePage'
import { UserPurchasesPage } from './pages/UserPurchasesPage'
import { UserLayout } from './pages/UserLayout'

const queryClient = new QueryClient()

function App() {
    return (
        <CookiesProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* public routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/results" element={<Search />} />
                            <Route
                                path="/courses/:id"
                                element={<CoursePage />}
                            ></Route>

                            {/* if user is unauthentificated they cannot access these */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/user" element={<UserLayout />}>
                                    <Route index element={<UserProfile />} />
                                    <Route
                                        path="purchases"
                                        element={<UserPurchasesPage />}
                                    />
                                    <Route
                                        path="settings"
                                        element={<UserSettings />}
                                    />
                                </Route>
                            </Route>

                            {/* if user is authentificated they cannot access these */}
                            <Route element={<PublicRoute />}>
                                <Route path="/sign_in" element={<SignIn />} />
                                <Route path="/sign_up" element={<SignUp />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </QueryClientProvider>
        </CookiesProvider>
    )
}

export default App
