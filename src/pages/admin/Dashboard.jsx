import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_pendaftar: 0,
        artikel_bulan_ini: 0,
        kegiatan_aktif: 0,
        pesan_baru: 0
    })
    const [recentPendaftar, setRecentPendaftar] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token')
                const [artRes, regRes, msgRes, kegRes] = await Promise.all([
                    axios.get('/api/articles?per_page=1'),
                    axios.get('/api/admin/pendaftaran', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/admin/pesan', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/kegiatan')
                ])

                const pendaftars = regRes.data || []

                setStats({
                    total_pendaftar: pendaftars.length,
                    artikel_bulan_ini: artRes.data.stats?.total || 0,
                    kegiatan_aktif: kegRes.data?.length || 0,
                    pesan_baru: msgRes.data?.filter(m => !m.is_read).length || 0
                })

                setRecentPendaftar(pendaftars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5))
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const summaryItems = [
        { icon: 'bi-people-fill', label: 'Total Pendaftar', value: stats.total_pendaftar, color: 'var(--accent-color)' },
        { icon: 'bi-journal-text', label: 'Artikel Baru', value: stats.artikel_bulan_ini, color: '#fff' },
        { icon: 'bi-calendar-event', label: 'Kegiatan Aktif', value: stats.kegiatan_aktif, color: 'var(--accent-color)' },
        { icon: 'bi-chat-dots-fill', label: 'Pesan Masuk', value: stats.pesan_baru, color: '#ff6366' },
    ]

    return (
        <>
            <div className="row g-4 mb-5">
                {summaryItems.map((item, index) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={index}>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ color: item.color }}>
                                <i className={`bi ${item.icon}`}></i>
                            </div>
                            <div>
                                <div className="stat-label">{item.label}</div>
                                <div className="stat-value">{item.value.toLocaleString('id-ID')}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mb-5">
                <div className="col-xl-8">
                    <div className="admin-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h6 fw-bold mb-0 text-uppercase text-accent" style={{ letterSpacing: '0.15em' }}>Pendaftar Terbaru</h2>
                            <Link to="/dashboard/pendaftar" className="text-decoration-none small fw-bold text-white-50 shadow-none">
                                KELOLA SEMUA <i className="bi bi-arrow-right ms-1"></i>
                            </Link>
                        </div>

                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nama Lengkap</th>
                                        <th>Jurusan</th>
                                        <th>NIM</th>
                                        <th className="text-end">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPendaftar.map((pendaftar, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="avatar-sm">{pendaftar.nama_lengkap.substring(0, 1).toUpperCase()}</div>
                                                    <span className="fw-bold">{pendaftar.nama_lengkap}</span>
                                                </div>
                                            </td>
                                            <td className="text-white-50">{pendaftar.jurusan}</td>
                                            <td className="text-white-50 font-monospace small">{pendaftar.nim}</td>
                                            <td className="text-end">
                                                <Link to={`/dashboard/pendaftar`} className="btn btn-sm btn-outline-light border-0 rounded-0 fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.05)' }}>DETAIL</Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentPendaftar.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-white-50 fst-italic">Data pendaftar belum tersedia.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4">
                    <div className="admin-card mb-4">
                        <h2 className="h6 fw-bold mb-4 text-uppercase text-accent" style={{ letterSpacing: '0.15em' }}>Aksi Cepat</h2>
                        <div className="d-grid gap-3">
                            <Link to="/dashboard/artikel/create" className="quick-link">
                                <div className="quick-link__icon"><i className="bi bi-plus-lg"></i></div>
                                <div className="quick-link__body">
                                    <span className="d-block fw-bold mb-1">Tulis Artikel</span>
                                    <small className="text-white-50">Publikasi berita terbaru</small>
                                </div>
                            </Link>
                            <Link to="/dashboard/kegiatan/create" className="quick-link">
                                <div className="quick-link__icon" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--accent-color)' }}><i className="bi bi-calendar-plus"></i></div>
                                <div className="quick-link__body">
                                    <span className="d-block fw-bold mb-1">Tambah Agenda</span>
                                    <small className="text-white-50">Jadwalkan kegiatan baru</small>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="admin-card text-center" style={{ background: 'var(--primary-color) !important', border: 'none' }}>
                        <h2 className="h6 fw-bold mb-4 text-uppercase text-white" style={{ letterSpacing: '0.15em' }}>Sistem Log</h2>
                        <div className="icon-badge mb-4 mx-auto" style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}><i className="bi bi-shield-check"></i></div>
                        <p className="small text-white-50 mb-4 px-3">Pastikan data pendaftar selalu dicadangkan secara berkala untuk keperluan arsip organisasi.</p>
                        <button className="btn-accent w-100" onClick={() => alert('Fitur Export dalam pengembangan.')}>
                            <i className="bi bi-cloud-arrow-down me-2"></i> BACKUP SEKARANG
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
