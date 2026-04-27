import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const OfficersManagement = () => {
    const [officers, setOfficers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/pengurus')
            setOfficers(res.data || [])
        } catch (error) {
            console.error('Error fetching officers:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus data pengurus ini?')) return
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`/api/admin/pengurus?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchData()
        } catch (error) {
            alert('Gagal menghapus')
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="h3 fw-black mb-1" style={{ letterSpacing: '-0.02em' }}>DATA PENGURUS</h1>
                    <p className="text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '0.1em' }}>Manajemen Staf UKM Cakra Manggala</p>
                </div>
                <Link to="/dashboard/pengurus/create" className="btn btn-accent d-inline-flex align-items-center gap-2">
                    <i className="bi bi-person-plus-fill"></i> TAMBAH PENGURUS
                </Link>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Urutan</th>
                            <th>Nama & Jabatan</th>
                            <th className="text-center">Status</th>
                            <th className="text-end">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="text-center py-5">
                                    <div className="spinner-border text-accent" role="status"></div>
                                </td>
                            </tr>
                        ) : officers.length > 0 ? officers.map(p => (
                            <tr key={p.id}>
                                <td className="text-center">
                                    <span className="fw-black text-accent">{p.urutan || '-'}</span>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-sm">
                                            {p.foto ? (
                                                <img src={p.foto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                            ) : (
                                                p.nama.substring(0, 1).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <div className="fw-bold text-white">{p.nama}</div>
                                            <div className="x-small text-white-50 fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
                                                {p.jabatan}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    {p.status === 'active' || p.status === 'Aktif' || !p.status ? (
                                        <span className="admin-badge admin-badge--success">AKTIF</span>
                                    ) : (
                                        <span className="admin-badge">NON-AKTIF</span>
                                    )}
                                </td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                        <Link to={`/dashboard/pengurus/edit/${p.id}`}
                                            className="btn btn-sm btn-outline-light border-0 rounded-0 fw-bold px-3"
                                            style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', letterSpacing: '0.1em' }}>EDIT</Link>
                                        <button onClick={() => handleDelete(p.id)}
                                            className="btn btn-sm border-0 rounded-0 fw-bold px-3"
                                            style={{ fontSize: '0.7rem', background: 'rgba(255,99,102,0.1)', color: '#ff6366', letterSpacing: '0.1em' }}>HAPUS</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-white-50 fst-italic">Data pengurus belum tersedia.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default OfficersManagement
