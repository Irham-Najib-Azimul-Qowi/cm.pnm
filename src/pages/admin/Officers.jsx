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
        if (!window.confirm('Hapus pengurus ini?')) return
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`/api/admin/pengurus/\${id}`, {
                headers: { Authorization: `Bearer \${token}` }
            })
            fetchData()
        } catch (error) {
            alert('Gagal menghapus')
        }
    }

    return (
        <div className="p-4 p-md-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4">
                <div>
                    <h1 className="h2 fw-bold text-white mb-1">Struktur Pengurus</h1>
                    <p className="text-white-50 small mb-0">Kelola daftar pengurus aktif UKM Cakra Manggala.</p>
                </div>
                <Link to="/dashboard/officers/create" className="btn-join-premium px-4 py-3 rounded-0 text-decoration-none" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-person-plus-fill me-2"></i> TAMBAH PENGURUS
                </Link>
            </div>

            <div className="row g-4">
                {loading ? (
                    <div className="col-12 text-center py-5"><div className="spinner-border text-accent"></div></div>
                ) : officers.length > 0 ? officers.map(o => (
                    <div className="col-md-6 col-xl-4" key={o.id}>
                        <div className="p-4 d-flex align-items-center gap-4" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="flex-shrink-0" style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                {o.foto && <img src={o.foto} alt="" className="w-100 h-100 object-fit-cover" />}
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                                <h4 className="fw-bold text-white mb-1 text-truncate">{o.nama}</h4>
                                <p className="small text-accent mb-2 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>{o.jabatan}</p>
                                <div className="d-flex gap-2">
                                    <Link to={`/dashboard/officers/edit/\${o.id}`} className="small text-white-50 text-decoration-none border-bottom border-secondary">Edit</Link>
                                    <button onClick={() => handleDelete(o.id)} className="small text-danger border-0 bg-transparent p-0 text-decoration-none border-bottom border-danger">Hapus</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 text-center py-5 text-white-50">Belum ada data pengurus.</div>
                )}
            </div>
        </div>
    )
}

export default OfficersManagement
