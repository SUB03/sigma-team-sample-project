import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Sign_up } from './pages/Sign_up'
import { Sign_in } from './pages/Sign_in'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign_up" element={<Sign_up />} />
                    <Route path="/sign_in" element={<Sign_in />} />
                </Routes>
            </HashRouter>
        </QueryClientProvider>
    )
}

export default App
