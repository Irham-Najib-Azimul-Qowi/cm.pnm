import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const RegistrationsManagement = () => {
    const [regs, setRegs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [jurusan, setJurusan] = useState('')

    const fetchData = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get('/api/admin/pendaftaran', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setRegs(res.data || [])
        } catch (error) {
            console.error('Error fetching registrations:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token')
            await axios.put(`/api/admin/pendaftaran?id=${id}`, { status, is_approved: status === 'approved' }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchData()
        } catch (error) {
            alert('Gagal update status')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus pendaftaran ini?')) return
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`/api/admin/pendaftaran?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchData()
        } catch (error) {
            alert('Gagal menghapus')
        }
    }

    const filteredRegs = regs.filter(r => {
        const matchSearch = r.nama_lengkap.toLowerCase().includes(search.toLowerCase()) || r.nim.toLowerCase().includes(search.toLowerCase())
        const matchJurusan = jurusan === '' || r.jurusan === jurusan
        return matchSearch && matchJurusan
    })

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="h3 fw-black mb-1" style={{ letterSpacing: '-0.02em' }}>CALON ANGGOTA</h1>
                    <p className="text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '0.1em' }}>Manajemen Rekrutmen Cakra Manggala</p>
                </div>
                <button onClick={() => alert('Fitur Export dalam pengembangan.')} className="btn btn-accent d-inline-flex align-items-center gap-2">
                    <i className="bi bi-file-earmark-spreadsheet-fill"></i> EXPORT DATA
                </button>
            </div>

            {/* Filters */}
            <div className="admin-card mb-5" style={{ padding: '1.5rem 2.5rem' }}>
                <div className="row g-3 align-items-end">
                    <div className="col-md-5">
                        <label className="small text-white-50 fw-bold text-uppercase mb-2 d-block" style={{ letterSpacing: '0.1em', fontSize: '0.65rem' }}>Cari Mahasiswa</label>
                        <input type="text" className="form-control admin-input" placeholder="Nama atau NIM..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label className="small text-white-50 fw-bold text-uppercase mb-2 d-block" style={{ letterSpacing: '0.1em', fontSize: '0.65rem' }}>Jurusan</label>
                        <select className="form-select admin-select" value={jurusan} onChange={(e) => setJurusan(e.target.value)}>
                            <option value="">Semua Jurusan</option>
                            <option value="Teknik">Teknik</option>
                            <option value="Akuntansi">Akuntansi</option>
                            <option value="Administrasi Bisnis">Administrasi Bisnis</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <button type="button" className="btn btn-primary w-100 py-2 border-0 rounded-0 fw-bold" style={{ background: 'var(--primary)', height: '50px', letterSpacing: '0.1em' }}>FILTER</button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mahasiswa</th>
                            <th>NIM</th>
                            <th className="d-none d-md-table-cell">Jurusan</th>
                            <th className="d-none d-md-table-cell text-center">Status</th>
                            <th className="d-none d-md-table-cell">Terdaftar</th>
                            <th className="text-end">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-5">
                                    <div className="spinner-border text-accent" role="status"></div>
                                </td>
                            </tr>
                        ) : filteredRegs.length > 0 ? filteredRegs.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-sm">
                                            {p.foto_diri ? (
                                                <img src={p.foto_diri} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                            ) : (
                                                p.nama_lengkap.substring(0, 1).toUpperCase()
                                            )}
                                        </div>
                                        <span className="fw-bold">{p.nama_lengkap}</span>
                                    </div>
                                </td>
                                <td className="font-monospace small text-white-50">{p.nim}</td>
                                <td className="small text-white-50 d-none d-md-table-cell">{p.jurusan}</td>
                                <td className="d-none d-md-table-cell text-center">
                                    {p.status === 'approved' || p.is_approved ? (
                                        <span className="admin-badge admin-badge--success">APPROVED</span>
                                    ) : p.status === 'rejected' ? (
                                        <span className="admin-badge admin-badge--danger">REJECTED</span>
                                    ) : (
                                        <span className="admin-badge admin-badge--warning">PENDING</span>
                                    )}
                                </td>
                                <td className="small text-white-50 d-none d-md-table-cell text-uppercase">
                                    {new Date(p.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                        {p.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleUpdateStatus(p.id, 'approved')} className="btn btn-sm btn-success rounded-0" style={{ fontSize: '0.65rem' }}>APPROVE</button>
                                                <button onClick={() => handleUpdateStatus(p.id, 'rejected')} className="btn btn-sm btn-outline-danger rounded-0" style={{ fontSize: '0.65rem' }}>REJECT</button>
                                            </>
                                        )}
                                        <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-outline-light border-0 rounded-0 fw-bold px-3" style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', letterSpacing: '0.1em' }} title="Hapus">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-white-50 fst-italic">Tidak ada pendaftar yang ditemukan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default RegistrationsManagement
