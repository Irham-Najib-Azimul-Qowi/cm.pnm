import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const OfficerForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = !!id

    const [formData, setFormData] = useState({
        nama: '',
        jabatan: '',
        foto: '',
        urutan: 0
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isEdit) {
            const fetchDetail = async () => {
                try {
                    const token = localStorage.getItem('token')
                    const res = await axios.get(`/api/admin/pengurus/\${id}`, {
                        headers: { Authorization: `Bearer \${token}` }
                    })
                    setFormData(res.data)
                } catch (error) {
                    console.error('Error fetching officer:', error)
                }
            }
            fetchDetail()
        }
    }, [id, isEdit])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const payload = {
                ...formData,
                urutan: parseInt(formData.urutan)
            }

            if (isEdit) {
                await axios.put(`/api/admin/pengurus/\${id}`, payload, {
                    headers: { Authorization: `Bearer \${token}` }
                })
            } else {
                await axios.post('/api/admin/pengurus', payload, {
                    headers: { Authorization: `Bearer \${token}` }
                })
            }
            navigate('/dashboard/officers')
        } catch (error) {
            alert('Gagal menyimpan data')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 p-md-5">
            <div className="mb-5">
                <h1 className="h2 fw-bold text-white mb-1">{isEdit ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}</h1>
                <p className="text-white-50 small">Kelola data kepengurusan untuk profil organisasi.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 p-md-5 bg-dark mx-auto" style={{ border: '1px solid rgba(255,255,255,0.05)', maxWidth: '600px' }}>
                <div className="mb-4">
                    <label className="form-label small fw-bold text-white-50 text-uppercase">Nama Lengkap</label>
                    <input
                        type="text"
                        className="form-control bg-transparent py-3 text-white rounded-0"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="form-label small fw-bold text-white-50 text-uppercase">Jabatan</label>
                    <input
                        type="text"
                        className="form-control bg-transparent py-3 text-white rounded-0"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        value={formData.jabatan}
                        onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                        placeholder="Contoh: Ketua Umum"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="form-label small fw-bold text-white-50 text-uppercase">Urutan Tampil (Prioritas)</label>
                    <input
                        type="number"
                        className="form-control bg-transparent py-3 text-white rounded-0"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        value={formData.urutan}
                        onChange={(e) => setFormData({ ...formData, urutan: e.target.value })}
                    />
                </div>
                <div className="mb-5">
                    <label className="form-label small fw-bold text-white-50 text-uppercase">URL Foto Profil</label>
                    <input
                        type="text"
                        className="form-control bg-transparent py-3 text-white rounded-0"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        value={formData.foto}
                        onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                        placeholder="https://..."
                    />
                </div>

                <div className="d-grid gap-3">
                    <button type="submit" className="btn-join-premium py-3 rounded-0 fw-bold" disabled={loading}>
                        {loading ? 'MENYIMPAN...' : 'SIMPAN DATA'}
                    </button>
                    <button type="button" className="btn btn-outline-light rounded-0 py-3 small fw-bold opacity-50" onClick={() => navigate('/dashboard/officers')}>BATAL</button>
                </div>
            </form>
        </div>
    )
}

export default OfficerForm
