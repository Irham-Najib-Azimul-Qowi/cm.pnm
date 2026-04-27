import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ActivitiesManagement = () => {
    const [kegiatans, setKegiatans] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchKegiatans = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/kegiatan')
            setKegiatans(res.data || [])
        } catch (error) {
            console.error('Error fetching activities:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchKegiatans()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus agenda ini?')) return
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`/api/admin/activities?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchKegiatans()
        } catch (error) {
            alert('Gagal menghapus kegiatan: ' + (error.response?.data?.error || error.message))
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="h3 fw-black mb-1" style={{ letterSpacing: '-0.02em' }}>AGENDA & KEGIATAN</h1>
                    <p className="text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '0.1em' }}>Manajemen Aktivitas Cakra Manggala</p>
                </div>
                <Link to="/dashboard/kegiatan/create" className="btn btn-accent d-inline-flex align-items-center gap-2">
                    <i className="bi bi-calendar-plus-fill"></i> TAMBAH AGENDA
                </Link>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '100px' }}>Jadwal</th>
                            <th style={{ width: '80px' }}>Foto</th>
                            <th>Detail Kegiatan</th>
                            <th className="d-none d-md-table-cell">Lokasi</th>
                            <th className="d-none d-md-table-cell text-center">Sifat</th>
                            <th className="text-end">Opsi Manajemen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-5">
                                    <div className="spinner-border text-accent" role="status"></div>
                                </td>
                            </tr>
                        ) : kegiatans.length > 0 ? kegiatans.map(kegiatan => {
                            const dateObj = new Date(kegiatan.tanggal_pelaksanaan)
                            const day = dateObj.getDate().toString().padStart(2, '0')
                            const month = dateObj.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()
                            return (
                                <tr key={kegiatan.id}>
                                    <td className="text-center">
                                        <div className="d-inline-flex flex-column align-items-center justify-content-center"
                                            style={{ width: '54px', height: '54px', background: 'var(--primary)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span className="fw-black text-white" style={{ fontSize: '1.25rem', lineHeight: '1' }}>{day}</span>
                                            <span className="x-small fw-bold text-accent" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>{month}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {kegiatan.gambar_utama ? (
                                            <img src={kegiatan.gambar_utama} style={{ width: '54px', height: '54px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} alt="" />
                                        ) : (
                                            <div style={{ width: '54px', height: '54px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <i className="bi bi-image text-white-50"></i>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="fw-bold text-white mb-1" style={{ fontSize: '1rem' }}>{kegiatan.judul_kegiatan}</div>
                                        <div className="x-small text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>PJ: {kegiatan.kapel_pj}</div>
                                    </td>
                                    <td className="small text-white-50 d-none d-md-table-cell">
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="bi bi-geo-alt-fill text-accent"></i>
                                            {kegiatan.tempat}
                                        </div>
                                    </td>
                                    <td className="text-center d-none d-md-table-cell">
                                        {kegiatan.sifat === 'internal' ? (
                                            <span className="admin-badge admin-badge--success">INTERNAL</span>
                                        ) : (
                                            <span className="admin-badge admin-badge--warning">EKSTERNAL</span>
                                        )}
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Link to={`/dashboard/kegiatan/edit/${kegiatan.id}`}
                                                className="btn btn-sm btn-outline-light border-0 rounded-0 fw-bold px-3"
                                                style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', letterSpacing: '0.1em' }}>EDIT</Link>
                                            <button onClick={() => handleDelete(kegiatan.id)} className="btn btn-sm border-0 rounded-0 fw-bold px-3"
                                                style={{ fontSize: '0.7rem', background: 'rgba(255,99,102,0.1)', color: '#ff6366', letterSpacing: '0.1em' }}>HAPUS</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-white-50 fst-italic">Belum ada agenda kegiatan yang terdaftar.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ActivitiesManagement
