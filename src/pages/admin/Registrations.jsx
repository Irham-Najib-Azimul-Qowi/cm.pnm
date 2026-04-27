import React, { useState, useEffect } from 'react'
import axios from 'axios'

const RegistrationsManagement = () => {
    const [regs, setRegs] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get('/api/admin/pendaftaran', {
                headers: { Authorization: `Bearer \${token}` }
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

    return (
        <div className="p-4 p-md-5">
            <div className="mb-5">
                <h1 className="h2 fw-bold text-white mb-1">Pendaftaran Anggota</h1>
                <p className="text-white-50 small">Review calon pengembara baru Cakra Manggala.</p>
            </div>

            <div className="p-0 overflow-hidden" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead>
                            <tr>
                                <th className="ps-4 py-4 small text-uppercase">Calon Anggota</th>
                                <th className="py-4 small text-uppercase">NIM / Jurusan</th>
                                <th className="py-4 small text-uppercase">Status</th>
                                <th className="pe-4 py-4 text-end small text-uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-5"><div className="spinner-border text-accent"></div></td></tr>
                            ) : regs.length > 0 ? regs.map(r => (
                                <tr key={r.id}>
                                    <td className="ps-4 py-4">
                                        <div className="fw-bold text-white">{r.nama_lengkap}</div>
                                        <div className="small text-white-50">{r.no_hp}</div>
                                    </td>
                                    <td>
                                        <div className="fw-bold">{r.nim}</div>
                                        <div className="small text-white-50">{r.jurusan} - {r.program_studi}</div>
                                    </td>
                                    <td>
                                        <span className={`px-2 py-1 small fw-bold \${r.status === 'approved' ? 'text-success' : r.status === 'rejected' ? 'text-danger' : 'text-warning'}`}>
                                            {r.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="pe-4 text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            {r.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleUpdateStatus(r.id, 'approved')} className="btn btn-sm btn-success rounded-0">APPROVE</button>
                                                    <button onClick={() => handleUpdateStatus(r.id, 'rejected')} className="btn btn-sm btn-outline-danger rounded-0">REJECT</button>
                                                </>
                                            )}
                                            <button onClick={() => handleDelete(r.id)} className="btn btn-sm btn-outline-light rounded-0 opacity-25 border-0"><i className="bi bi-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center py-5 text-white-50">Belum ada pendaftaran baru.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RegistrationsManagement
