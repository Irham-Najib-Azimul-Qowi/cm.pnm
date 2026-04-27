import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ArticlesManagement = () => {
    const [artikels, setArtikels] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({})

    const fetchArtikels = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/articles?per_page=100')
            setArtikels(res.data.data || [])
            setStats(res.data.stats || {})
        } catch (error) {
            console.error('Error fetching articles:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchArtikels()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus artikel ini?')) return
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`/api/admin/articles?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchArtikels()
        } catch (error) {
            alert('Gagal menghapus artikel: ' + (error.response?.data?.error || error.message))
        }
    }

    return (
        <div className="p-4 p-md-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4">
                <div>
                    <h1 className="h2 fw-bold text-white mb-1">Manajemen Artikel</h1>
                    <p className="text-white-50 small mb-0">Kelola publikasi, draf, dan konten edukasi.</p>
                </div>
                <Link to="/dashboard/articles/create" className="btn-join-premium px-4 py-3 rounded-0 text-decoration-none" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-plus-lg me-2"></i> TULIS ARTIKEL BARU
                </Link>
            </div>

            {/* Stats Row */}
            <div className="row g-4 mb-5">
                {[
                    { label: 'Total Artikel', value: stats.total || 0, icon: 'bi-journal-text', color: 'bg-primary' },
                    { label: 'Published', value: stats.published || 0, icon: 'bi-check-circle', color: 'bg-success' },
                    { label: 'Draft', value: stats.draft || 0, icon: 'bi-pencil-square', color: 'bg-warning' },
                    { label: 'Total Views', value: stats.total_views || 0, icon: 'bi-eye', color: 'bg-info' },
                ].map((s, i) => (
                    <div className="col-sm-6 col-xl-3" key={i}>
                        <div className="p-4" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="small text-uppercase fw-bold text-white-50">{s.label}</span>
                                <i className={`bi \${s.icon} text-accent`}></i>
                            </div>
                            <h3 className="h2 fw-bold text-white mb-0">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="p-0 overflow-hidden" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <tr>
                                <th className="ps-4 py-4 border-0 small text-uppercase">Artikel</th>
                                <th className="py-4 border-0 small text-uppercase">Status</th>
                                <th className="py-4 border-0 small text-uppercase">Views</th>
                                <th className="py-4 border-0 small text-uppercase">Tanggal</th>
                                <th className="pe-4 py-4 border-0 text-end small text-uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="spinner-border text-accent" role="status"></div>
                                    </td>
                                </tr>
                            ) : artikels.length > 0 ? artikels.map(art => (
                                <tr key={art.id} style={{ transition: 'all 0.3s' }}>
                                    <td className="ps-4 py-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div style={{ width: '60px', height: '40px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                                {art.gambar_utama && <img src={art.gambar_utama} alt="" className="w-100 h-100 object-fit-cover" />}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-white">{art.judul}</div>
                                                <div className="small text-white-50">oleh {art.user?.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`px-3 py-1 small fw-bold \${art.status === 'published' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                            {art.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="fw-bold">{art.views}</td>
                                    <td className="small text-white-50">{new Date(art.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="pe-4 text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Link to={`/dashboard/articles/edit/\${art.id}`} className="btn btn-sm btn-outline-light rounded-0 border-0 p-2" title="Edit">
                                                <i className="bi bi-pencil-fill"></i>
                                            </Link>
                                            <button onClick={() => handleDelete(art.id)} className="btn btn-sm btn-outline-danger rounded-0 border-0 p-2" title="Hapus">
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-white-50 italic">Belum ada artikel.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ArticlesManagement
