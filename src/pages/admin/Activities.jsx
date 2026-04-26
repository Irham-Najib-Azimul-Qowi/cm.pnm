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
        if (!window.confirm('Yakin ingin menghapus kegiatan ini?')) return
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`/api/admin/activities/\${id}`, {
                headers: { Authorization: `Bearer \${token}` }
            })
            fetchKegiatans()
        } catch (error) {
            alert('Gagal menghapus kegiatan: ' + (error.response?.data?.error || error.message))
        }
    }

    return (
        <div className="p-4 p-md-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4">
                <div>
                    <h1 className="h2 fw-bold text-white mb-1">Manajemen Kegiatan</h1>
                    <p className="text-white-50 small mb-0">Arsip rekam jejak dan dokumentasi UKM.</p>
                </div>
                <Link to="/dashboard/activities/create" className="btn-join-premium px-4 py-3 rounded-0 text-decoration-none" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-plus-lg me-2"></i> TAMBAH KEGIATAN BARU
                </Link>
            </div>

            <div className="p-0 overflow-hidden" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <tr>
                                <th className="ps-4 py-4 border-0 small text-uppercase">Nama Kegiatan</th>
                                <th className="py-4 border-0 small text-uppercase">Tahun</th>
                                <th className="py-4 border-0 small text-uppercase">Sifat</th>
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
                            ) : kegiatans.length > 0 ? kegiatans.map(keg => (
                                <tr key={keg.id}>
                                    <td className="ps-4 py-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div style={{ width: '60px', height: '40px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                                {keg.gambar_utama && <img src={keg.gambar_utama} alt="" className="w-100 h-100 object-fit-cover" />}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-white">{keg.judul_kegiatan}</div>
                                                <div className="small text-white-50">{keg.tempat}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="fw-bold">{keg.tahun}</td>
                                    <td>
                                        <span className={`px-2 py-1 small fw-bold \${keg.sifat === 'internal' ? 'text-info' : 'text-accent'}`}>
                                            {keg.sifat.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="small text-white-50">{new Date(keg.tanggal_pelaksanaan).toLocaleDateString('id-ID')}</td>
                                    <td className="pe-4 text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Link to={`/dashboard/activities/edit/\${keg.id}`} className="btn btn-sm btn-outline-light rounded-0 border-0 p-2">
                                                <i className="bi bi-pencil-fill"></i>
                                            </Link>
                                            <button onClick={() => handleDelete(keg.id)} className="btn btn-sm btn-outline-danger rounded-0 border-0 p-2">
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-white-50 italic">Belum ada data kegiatan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ActivitiesManagement
