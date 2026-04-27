import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const ActivityForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = !!id

    const [formData, setFormData] = useState({
        judul_kegiatan: '',
        tahun: new Date().getFullYear(),
        tanggal_pelaksanaan: '',
        materi: '',
        tempat: '',
        kapel_pj: '',
        sifat: 'internal',
        gambar_utama: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isEdit) {
            const fetchDetail = async () => {
                try {
                    const token = localStorage.getItem('token')
                    const res = await axios.get(`/api/admin/activities?id=${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    // Format date for input: "2023-11-20"
                    const date = res.data.tanggal_pelaksanaan ? res.data.tanggal_pelaksanaan.split('T')[0] : ''
                    setFormData({ ...res.data, tanggal_pelaksanaan: date })
                } catch (error) {
                    console.error('Error fetching activity:', error)
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
                tahun: parseInt(formData.tahun),
                tanggal_pelaksanaan: new Date(formData.tanggal_pelaksanaan).toISOString()
            }

            if (isEdit) {
                await axios.put(`/api/admin/activities?id=${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } else {
                await axios.post('/api/admin/activities', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            }
            navigate('/dashboard/kegiatan')
        } catch (error) {
            alert('Gagal menyimpan kegiatan: ' + (error.response?.data?.error || error.message))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 p-md-5">
            <div className="mb-5">
                <h1 className="h2 fw-bold text-white mb-1">{isEdit ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}</h1>
                <p className="text-white-50 small">Dokumentasikan agenda UKM untuk transparansi dan sejarah.</p>
            </div>

            <form onSubmit={handleSubmit} className="row g-4">
                <div className="col-lg-8">
                    <div className="p-4 bg-dark h-100" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-white-50 text-uppercase">Nama Kegiatan</label>
                            <input
                                type="text"
                                className="form-control bg-transparent py-3 text-white rounded-0"
                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                value={formData.judul_kegiatan}
                                onChange={(e) => setFormData({ ...formData, judul_kegiatan: e.target.value })}
                                required
                            />
                        </div>

                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-white-50 text-uppercase">Tempat Pelaksanaan</label>
                                <input
                                    type="text"
                                    className="form-control bg-transparent py-3 text-white rounded-0"
                                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                    value={formData.tempat}
                                    onChange={(e) => setFormData({ ...formData, tempat: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-white-50 text-uppercase">Kapel / PJ</label>
                                <input
                                    type="text"
                                    className="form-control bg-transparent py-3 text-white rounded-0"
                                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                    value={formData.kapel_pj}
                                    onChange={(e) => setFormData({ ...formData, kapel_pj: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-0">
                            <label className="form-label small fw-bold text-white-50 text-uppercase">Materi / Deskripsi</label>
                            <textarea
                                className="form-control bg-transparent py-3 text-white rounded-0"
                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                rows="6"
                                value={formData.materi}
                                onChange={(e) => setFormData({ ...formData, materi: e.target.value })}
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="p-4 bg-dark" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-white-50 text-uppercase">Sifat Kegiatan</label>
                            <select
                                className="form-select bg-dark text-white rounded-0 py-3"
                                value={formData.sifat}
                                onChange={(e) => setFormData({ ...formData, sifat: e.target.value })}
                            >
                                <option value="internal">INTERNAL</option>
                                <option value="eksternal">EKSTERNAL</option>
                            </select>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <label className="form-label small fw-bold text-white-50 text-uppercase">Tahun</label>
                                <input
                                    type="number"
                                    className="form-control bg-transparent py-3 text-white rounded-0"
                                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                    value={formData.tahun}
                                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label small fw-bold text-white-50 text-uppercase">Tanggal</label>
                                <input
                                    type="date"
                                    className="form-control bg-transparent py-3 text-white rounded-0"
                                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                    value={formData.tanggal_pelaksanaan}
                                    onChange={(e) => setFormData({ ...formData, tanggal_pelaksanaan: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="form-label small fw-bold text-white-50 text-uppercase">URL Gambar Header</label>
                            <input
                                type="text"
                                className="form-control bg-transparent py-2 text-white rounded-0"
                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                placeholder="https://..."
                                value={formData.gambar_utama}
                                onChange={(e) => setFormData({ ...formData, gambar_utama: e.target.value })}
                            />
                        </div>

                        <div className="d-grid gap-3">
                            <button
                                type="submit"
                                className="btn-join-premium py-3 rounded-0 fw-bold"
                                disabled={loading}
                            >
                                {loading ? 'MENYIMPAN...' : 'SIMPAN KEGIATAN'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-light rounded-0 py-3 small fw-bold opacity-50"
                                onClick={() => navigate('/dashboard/kegiatan')}
                            >
                                BATAL
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ActivityForm
