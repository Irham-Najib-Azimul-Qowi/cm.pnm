import React, { useState, useEffect } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [user, setUser] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    if (!token) {
        return <Navigate to="/login" />
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const sidebarLinks = [
        { name: 'Ikhtisar', path: '/dashboard', icon: 'bi-speedometer2' },
        { name: 'Artikel', path: '/dashboard/artikel', icon: 'bi-journal-richtext' },
        { name: 'Kegiatan', path: '/dashboard/kegiatan', icon: 'bi-calendar-event' },
        { name: 'Pengurus', path: '/dashboard/pengurus', icon: 'bi-people' },
        { name: 'Pendaftar', path: '/dashboard/pendaftar', icon: 'bi-person-plus' },
        { name: 'Pesan', path: '/dashboard/pesan', icon: 'bi-chat-left-dots' },
    ]

    const date = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="dashboard-container">
            <div className={`mobile-toggle ${isSidebarOpen ? 'd-none' : 'd-flex'}`}>
                <div className="d-flex align-items-center gap-3">
                    <img src="/image/logo.png" width="32" alt="Logo" />
                    <span className="fw-bold" style={{ fontFamily: 'Montserrat', letterSpacing: '0.2em', fontSize: '0.8rem' }}>CAKRA</span>
                </div>
                <button className="btn-menu" onClick={() => setIsSidebarOpen(true)}><i className="bi bi-list fs-4"></i></button>
            </div>

            <aside className={`sidebar ${isSidebarOpen ? 'show' : ''}`} id="sidebar">
                <Link to="/dashboard" className="sidebar-brand">
                    <img src="/image/logo.png" alt="Logo" />
                    <span>Admin Control</span>
                </Link>

                <nav className="sidebar-nav">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path || location.pathname.startsWith(`${link.path}/`) ? 'active' : ''}`}
                        >
                            <i className={`bi ${link.icon}`}></i> {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-widget">
                        <div className="user-avatar">{user ? user.name.charAt(0).toUpperCase() : 'A'}</div>
                        <div className="overflow-hidden">
                            <div className="small fw-bold text-white text-truncate">
                                {user ? user.name : 'Admin'}
                            </div>
                            <div className="text-accent" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800 }}>
                                {user ? user.role : 'Administrator'}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn-logout border-0 w-100">
                        <i className="bi bi-power"></i> Logout
                    </button>
                </div>
            </aside>

            <div className="main-wrapper">
                <header className="main-header d-none d-lg-flex">
                    <div>
                        <h1 className="h5 fw-black mb-1" style={{ letterSpacing: '-0.01em', color: '#fff' }}>
                            PANEL KENDALI
                        </h1>
                        <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {date}
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <Link to="/" target="_blank" className="btn-accent text-decoration-none">
                            <i className="bi bi-eye-fill me-2"></i> Kunjungi Situs
                        </Link>
                    </div>
                </header>

                <main className="main-content">
                    {children}
                </main>
            </div>

            <div className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
        </div>
    )
}

export default AdminLayout
