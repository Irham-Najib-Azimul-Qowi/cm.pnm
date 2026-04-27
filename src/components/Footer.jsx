import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Footer = () => {
    const [latestActivities, setLatestActivities] = useState([])

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const res = await axios.get('/api/kegiatan?limit=2')
                setLatestActivities(res.data || [])
            } catch (err) {
                console.error('Failed to load footer activities:', err)
            }
        }
        fetchFooterData()

        const footerEl = document.querySelector('[data-footer-reveal]')
        if (footerEl) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        footerEl.classList.add('is-visible')
                        observer.disconnect()
                    }
                })
            }, { threshold: 0.1 })
            observer.observe(footerEl)

            return () => observer.disconnect()
        }
    }, [])

    return (
        <footer className="footer" data-footer-reveal>
            <div className="container">
                <div className="row footer-grid">
                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="footer-column" data-footer-item>
                            <Link to="/" className="footer-logo">
                                <img src="/image/logo.png" alt="Logo Cakra Manggala" />
                                <span>
                                    <strong>Cakra Manggala</strong>
                                    <span>UKM Pecinta Alam</span>
                                </span>
                            </Link>
                            <h5 className="footer-title">Visi Singkat</h5>
                            <p className="footer-description">Menjadi ruang bertumbuh bagi mahasiswa yang tangguh, terampil, dan bertanggung jawab dalam petualangan serta pelestarian alam.</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="footer-column" data-footer-item>
                            <h5 className="footer-title">Quick Links</h5>
                            <ul className="footer-list">
                                <li><Link to="/">Beranda</Link></li>
                                <li><Link to="/artikel">Artikel</Link></li>
                                <li><Link to="/kegiatan">Kegiatan</Link></li>
                                <li><Link to="/bergabung">Gabung</Link></li>
                                <li><Link to="/kontak">Kontak</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="footer-column" data-footer-item>
                            <h5 className="footer-title">Latest Activities</h5>
                            <ul className="footer-list">
                                {latestActivities.length > 0 ? (
                                    latestActivities.map(activity => (
                                        <li key={activity.id}>
                                            <Link to="/kegiatan">
                                                <span className="footer-list-title">{activity.judul_kegiatan}</span>
                                                <span className="footer-list-date">
                                                    {new Date(activity.tanggal_pelaksanaan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} · {activity.tempat}
                                                </span>
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <>
                                        <li>
                                            <Link to="/kegiatan">
                                                <span className="footer-list-title">Lihat arsip kegiatan</span>
                                                <span className="footer-list-date">Dokumentasi kegiatan dan aktivitas lapangan terbaru.</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/artikel">
                                                <span className="footer-list-title">Buka halaman artikel</span>
                                                <span className="footer-list-date">Update artikel, catatan perjalanan, dan laporan kegiatan.</span>
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="footer-column" data-footer-item>
                            <h5 className="footer-title">Stay Connected</h5>
                            <div className="footer-social">
                                <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                                <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                                <a href="#" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
                            </div>
                            <p className="footer-address">Sekretariat UKM Pecinta Alam Cakra Manggala<br />Politeknik Negeri Madiun<br />Madiun, Jawa Timur</p>
                            <Link to="/kontak" className="footer-action">
                                <i className="bi bi-envelope-open"></i>
                                <span>Contact</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom__inner">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Cakra Manggala. All rights reserved.</p>
                        <p className="footer-note mb-0">Build for explorers, training, and environmental stewardship.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
