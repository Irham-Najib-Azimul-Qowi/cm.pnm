import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Activities from './pages/Activities'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Contact from './pages/Contact'
import Join from './pages/Join'
import Login from './pages/Login'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/admin/Dashboard'

function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

function App() {
    const location = useLocation()
    const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/login' || location.pathname === '/join'

    return (
        <div className="app-wrapper">
            <ScrollToTop />
            {!isDashboard && <Navbar />}
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tentang-kami" element={<About />} />
                    <Route path="/kegiatan" element={<Activities />} />
                    <Route path="/artikel" element={<Articles />} />
                    <Route path="/artikel/:slug" element={<ArticleDetail />} />
                    <Route path="/kontak" element={<Contact />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/login" element={<Login />} />

                    {/* Admin Protected Routes */}
                    <Route path="/dashboard" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="articles" element={<div className="p-4"><h1 className="text-white">Articles Management</h1></div>} />
                        <Route path="activities" element={<div className="p-4"><h1 className="text-white">Activities Management</h1></div>} />
                    </Route>
                </Routes>
            </main>
            {!isDashboard && <Footer />}
        </div>
    )
}

export default function Root() {
    return (
        <Router>
            <App />
        </Router>
    )
}
