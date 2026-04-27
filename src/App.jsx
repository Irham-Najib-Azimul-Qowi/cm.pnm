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
import ArticlesManagement from './pages/admin/Articles'
import ArticleForm from './pages/admin/ArticleForm'
import ActivitiesManagement from './pages/admin/Activities'
import ActivityForm from './pages/admin/ActivityForm'
import RegistrationsManagement from './pages/admin/Registrations'
import MessagesManagement from './pages/admin/Messages'
import OfficersManagement from './pages/admin/Officers'
import OfficerForm from './pages/admin/OfficerForm'

function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

function App() {
    const location = useLocation()
    const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/login' || location.pathname === '/join' || location.pathname === '/bergabung'

    useEffect(() => {
        if (!isDashboard) {
            document.body.classList.add('layout-overlay-nav')
        } else {
            document.body.classList.remove('layout-overlay-nav')
        }
    }, [isDashboard])

    return (
        <div className="app-wrapper">
            <ScrollToTop />
            {!isDashboard && <Navbar />}
            <main className={isDashboard ? 'p-0' : ''}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tentang-kami" element={<About />} />
                    <Route path="/kegiatan" element={<Activities />} />
                    <Route path="/artikel" element={<Articles />} />
                    <Route path="/artikel/:slug" element={<ArticleDetail />} />
                    <Route path="/kontak" element={<Contact />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/bergabung" element={<Join />} />
                    <Route path="/login" element={<Login />} />

                    {/* Admin Protected Routes */}
                    <Route path="/dashboard" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="artikel" element={<ArticlesManagement />} />
                        <Route path="artikel/create" element={<ArticleForm />} />
                        <Route path="artikel/edit/:id" element={<ArticleForm />} />
                        <Route path="kegiatan" element={<ActivitiesManagement />} />
                        <Route path="kegiatan/create" element={<ActivityForm />} />
                        <Route path="kegiatan/edit/:id" element={<ActivityForm />} />
                        <Route path="pendaftar" element={<RegistrationsManagement />} />
                        <Route path="pesan" element={<MessagesManagement />} />
                        <Route path="pengurus" element={<OfficersManagement />} />
                        <Route path="pengurus/create" element={<OfficerForm />} />
                        <Route path="pengurus/edit/:id" element={<OfficerForm />} />
                        <Route path="articles" element={<ArticlesManagement />} />
                        <Route path="articles/create" element={<ArticleForm />} />
                        <Route path="articles/edit/:id" element={<ArticleForm />} />
                        <Route path="activities" element={<ActivitiesManagement />} />
                        <Route path="activities/create" element={<ActivityForm />} />
                        <Route path="activities/edit/:id" element={<ActivityForm />} />
                        <Route path="registrations" element={<RegistrationsManagement />} />
                        <Route path="messages" element={<MessagesManagement />} />
                        <Route path="officers" element={<OfficersManagement />} />
                        <Route path="officers/create" element={<OfficerForm />} />
                        <Route path="officers/edit/:id" element={<OfficerForm />} />
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
