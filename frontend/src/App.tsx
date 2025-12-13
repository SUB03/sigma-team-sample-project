import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CookiesProvider } from 'react-cookie'
import { HashRouter, Routes, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { Sign_up } from './pages/Sign_up'
import { Sign_in } from './pages/Sign_in'
import { UserProfile } from './pages/UserProfile'
import RouteGuard from './components/routeGuard'

const queryClient = new QueryClient()

function App() {
    return (
        <CookiesProvider>
            <QueryClientProvider client={queryClient}>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/sign_up"
                            element={
                                <RouteGuard isLoginRoute>
                                    <Sign_up />
                                </RouteGuard>
                            }
                        />
                        <Route
                            path="/sign_in"
                            element={
                                <RouteGuard isLoginRoute>
                                    <Sign_in />
                                </RouteGuard>
                            }
                        />
                        <Route
                            path="/user"
                            element={
                                <RouteGuard>
                                    <UserProfile />
                                </RouteGuard>
                            }
                        />
                    </Routes>
                </HashRouter>
            </QueryClientProvider>
        </CookiesProvider>
    )
}

export default App
