import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ArticlesManagement = () => {
    const [artikels, setArtikels] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchArtikels = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/articles?per_page=100')
            setArtikels(res.data.data || [])
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
        if (!window.confirm('Hapus artikel ini?')) return
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

    const toggleStatus = async (artikel) => {
        try {
            const token = localStorage.getItem('token')
            const nextStatus = artikel.status === 'published' ? 'draft' : 'published'
            await axios.put(`/api/admin/articles?id=${artikel.id}`, { status: nextStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchArtikels()
        } catch (error) {
            alert('Gagal update status artikel: ' + (error.response?.data?.error || error.message))
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="h3 fw-black mb-1" style={{ letterSpacing: '-0.02em' }}>KONTEN & ARTIKEL</h1>
                    <p className="text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '0.1em' }}>Pusat Publikasi Cakra Manggala</p>
                </div>
                <Link to="/dashboard/artikel/create" className="btn btn-accent d-inline-flex align-items-center gap-2">
                    <i className="bi bi-plus-lg"></i> TULIS ARTIKEL
                </Link>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Informasi Artikel</th>
                            <th className="d-none d-md-table-cell">Penulis</th>
                            <th className="d-none d-md-table-cell text-center">Interaksi</th>
                            <th className="d-none d-md-table-cell text-center">Status</th>
                            <th className="text-end">Opsi Manajemen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    <div className="spinner-border text-accent" role="status"></div>
                                </td>
                            </tr>
                        ) : artikels.length > 0 ? artikels.map(artikel => (
                            <tr key={artikel.id}>
                                <td>
                                    <div className="d-flex align-items-center gap-4">
                                        <div style={{ width: '80px', height: '54px', background: 'rgba(0,0,0,0.5)', flexShrink: 0, border: '1px solid rgba(255,255,255,0.05)' }}>
                                            {artikel.gambar_utama ? (
                                                <img src={artikel.gambar_utama} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} alt="" />
                                            ) : (
                                                <div className="d-flex align-items-center justify-content-center h-100"><i className="bi bi-image text-white-50"></i></div>
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="fw-bold mb-1" style={{ fontSize: '1rem' }}>
                                                {artikel.judul}
                                            </div>
                                            <div className="text-white-50 x-small fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                                                {new Date(artikel.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="small text-white-50 d-none d-md-table-cell">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-person-circle"></i>
                                        {artikel.user?.name || 'Administrator'}
                                    </div>
                                </td>
                                <td className="text-center d-none d-md-table-cell">
                                    <div className="small fw-bold"><i className="bi bi-eye-fill text-accent me-1"></i>
                                        {artikel.views?.toLocaleString('id-ID') || 0}
                                    </div>
                                </td>
                                <td className="text-center d-none d-md-table-cell">
                                    {artikel.status === 'published' ? (
                                        <span className="admin-badge admin-badge--success">PUBLISHED</span>
                                    ) : (
                                        <span className="admin-badge">DRAFT</span>
                                    )}
                                </td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                        <Link to={`/dashboard/artikel/edit/${artikel.id}`}
                                            className="btn btn-sm btn-outline-light border-0 rounded-0 fw-bold px-3"
                                            style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', letterSpacing: '0.1em' }}>EDIT</Link>
                                        <button onClick={() => toggleStatus(artikel)}
                                            className="btn btn-sm border-0 rounded-0 fw-bold px-3"
                                            style={{ fontSize: '0.7rem', background: artikel.status === 'published' ? 'rgba(255,99,102,0.1)' : 'var(--primary)', color: artikel.status === 'published' ? '#ff6366' : 'var(--accent)', letterSpacing: '0.1em' }}>
                                            {artikel.status === 'published' ? 'DRAFT' : 'PUBLISH'}
                                        </button>
                                        <button onClick={() => handleDelete(artikel.id)}
                                            className="btn btn-sm border-0 rounded-0 fw-bold px-3"
                                            style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.05)', color: '#ff6366', letterSpacing: '0.1em' }}>HAPUS</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-white-50 fst-italic">Belum ada artikel yang dipublikasikan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ArticlesManagement
