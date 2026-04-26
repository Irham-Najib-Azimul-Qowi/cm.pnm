import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'

// Placeholder for other pages
const About = () => <div className="container py-5"><h1 className="text-white">Tentang Kami</h1></div>
const Activities = () => <div className="container py-5"><h1 className="text-white">Kegiatan</h1></div>
const Articles = () => <div className="container py-5"><h1 className="text-white">Artikel</h1></div>
const Contact = () => <div className="container py-5"><h1 className="text-white">Kontak</h1></div>
const Join = () => <div className="container py-5"><h1 className="text-white">Bergabung</h1></div>

function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

function App() {
    const location = useLocation()
    const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/login'

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
                    <Route path="/kontak" element={<Contact />} />
                    <Route path="/bergabung" element={<Join />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
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
