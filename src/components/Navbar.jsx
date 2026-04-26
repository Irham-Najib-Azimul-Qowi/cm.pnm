import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 24)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        // Close menu when route changes
        setIsMenuOpen(false)
        document.body.classList.remove('site-menu-open')
    }, [location])

    const toggleMenu = () => {
        const newState = !isMenuOpen
        setIsMenuOpen(newState)
        document.body.classList.toggle('site-menu-open', newState)
    }

    const navLinks = [
        { name: 'Beranda', path: '/' },
        { name: 'Tentang', path: '/tentang-kami' },
        { name: 'Artikel', path: '/artikel' },
        { name: 'Kegiatan', path: '/kegiatan' },
        { name: 'Kontak', path: '/kontak' },
    ]

    return (
        <>
            <nav className={`site-navbar ${isScrolled ? 'is-scrolled' : ''}`}>
                <div className="container">
                    <div className="site-navbar-shell">
                        <Link className="site-brand" to="/">
                            <img src="/image/logo.png" alt="Logo Cakra Manggala" />
                            <span className="site-brand-label">Cakra Manggala</span>
                        </Link>

                        <div className="site-navbar-links">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    className={`site-navbar-link ${location.pathname === link.path ? 'is-active' : ''}`}
                                    to={link.path}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="site-navbar-actions">
                            <Link to="/bergabung" className="site-navbar-join">Gabung</Link>
                            <button
                                type="button"
                                className="site-menu-trigger"
                                onClick={toggleMenu}
                                aria-expanded={isMenuOpen}
                            >
                                <span className="site-menu-trigger__label">Menu</span>
                                <span className="site-menu-trigger__icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div
                className={`site-menu-backdrop ${isMenuOpen ? 'show' : ''}`}
                onClick={() => toggleMenu(false)}
                style={{ display: isMenuOpen ? 'block' : 'none', opacity: isMenuOpen ? 1 : 0 }}
            ></div>

            <aside className={`site-menu-panel ${isMenuOpen ? 'show' : ''}`} style={{ visibility: isMenuOpen ? 'visible' : 'hidden', opacity: isMenuOpen ? 1 : 0, transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
                <div className="site-menu-panel__inner">
                    <div className="site-menu-panel__header">
                        <div>
                            <div className="site-menu-panel__eyebrow">Navigasi</div>
                            <h2 className="site-menu-panel__title">Menu</h2>
                        </div>
                        <button type="button" className="site-menu-close" onClick={() => toggleMenu(false)}>
                            <span>Tutup</span>
                            <span className="site-menu-close__icon">
                                <span></span>
                                <span></span>
                            </span>
                        </button>
                    </div>

                    <div className="site-menu-panel__body">
                        <nav className="site-menu-links">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    className={`site-menu-link ${location.pathname === link.path ? 'is-active' : ''}`}
                                    to={link.path}
                                >
                                    <span>{link.name}</span>
                                    <i className="bi bi-arrow-up-right"></i>
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-4">
                            <Link to="/bergabung" className="site-menu-join">
                                <span>Gabung Sekarang</span>
                                <i className="bi bi-person-plus-fill"></i>
                            </Link>
                        </div>

                        <div className="site-menu-panel__meta">
                            <div className="site-menu-panel__contact">
                                Sekretariat UKM Pecinta Alam Cakra Manggala<br />
                                Politeknik Negeri Madiun
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Navbar
