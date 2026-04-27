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
        prodi_semester: '',
        instagram_url: '',
        foto: '',
        urutan: 1,
        status: 'active'
    })
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (isEdit) {
            const fetchDetail = async () => {
                try {
                    const token = localStorage.getItem('token')
                    const res = await axios.get(`/api/admin/pengurus?id=${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
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
                urutan: parseInt(formData.urutan) || 1
            }

            if (isEdit) {
                await axios.put(`/api/admin/pengurus?id=${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } else {
                await axios.post('/api/admin/pengurus', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            }
            navigate('/dashboard/pengurus')
        } catch (error) {
            alert('Gagal menyimpan data pengurus')
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const uploadData = new FormData()
        uploadData.append('gambar', file)

        try {
            setUploading(true)
            const token = localStorage.getItem('token') || ''
            const res = await axios.post('/api/upload', uploadData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.data.url) {
                setFormData(prev => ({ ...prev, foto: res.data.url }))
            }
        } catch (err) {
            alert('Gagal mengunggah gambar ke server Vercel.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="p-4 p-md-5">
            <div className="mb-5">
                <button onClick={() => navigate('/dashboard/pengurus')}
                    className="btn btn-sm d-inline-flex align-items-center gap-2 border-0 rounded-0"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.8rem 1.5rem' }}>
                    <i className="bi bi-arrow-left"></i> KEMBALI
                </button>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="admin-card p-0 overflow-hidden border-0 shadow-lg" style={{ background: 'var(--dark-card)' }}>
                        <div className="p-4 p-lg-5"
                            style={{ background: 'var(--primary)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <h1 className="h3 fw-black mb-1" style={{ letterSpacing: '-0.01em' }}>
                                    {isEdit ? 'EDIT PENGURUS' : 'TAMBAH PENGURUS'}
                                </h1>
                                <p className="mb-0 text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '0.1em' }}>
                                    {isEdit ? 'Perbarui Data Personel' : 'Daftarkan Personel Pengurus Baru'}
                                </p>
                            </div>
                            <i className="bi bi-person-plus-fill"
                                style={{ position: 'absolute', right: '-20px', bottom: '-30px', fontSize: '10rem', color: 'rgba(255,255,255,0.05)', zIndex: 1 }}></i>
                        </div>

                        <div className="p-4 p-lg-5">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-12">
                                        <label className="form-label fw-black small text-uppercase text-accent mb-3"
                                            style={{ letterSpacing: '0.15em', fontSize: '0.7rem' }}>NAMA LENGKAP <span
                                                className="text-danger">*</span></label>
                                        <input type="text" name="nama"
                                            className="form-control admin-input"
                                            value={formData.nama}
                                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                            placeholder="Contoh: Najib Azimul Qowi" required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-black small text-uppercase text-accent mb-3"
                                            style={{ letterSpacing: '0.15em', fontSize: '0.7rem' }}>JABATAN <span
                                                className="text-danger">*</span></label>
                                        <input type="text" name="jabatan"
                                            className="form-control admin-input"
                                            value={formData.jabatan}
                                            onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                                            placeholder="Contoh: Ketua Umum" required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-black small text-uppercase text-accent mb-3"
                                            style={{ letterSpacing: '0.15em', fontSize: '0.7rem' }}>PRODI & SEMESTER</label>
                                        <input type="text" name="prodi_semester"
                                            className="form-control admin-input"
                                            value={formData.prodi_semester || ''}
                                            onChange={(e) => setFormData({ ...formData, prodi_semester: e.target.value })}
                                            placeholder="Contoh: Teknik Elektro / Semester 4" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-black small text-uppercase text-accent mb-3"
                                            style={{ letterSpacing: '0.15em', fontSize: '0.7rem' }}>URL INSTAGRAM</label>
                                        <input type="url" name="instagram_url"
                                            className="form-control admin-input"
                                            value={formData.instagram_url || ''}
                                            onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                                            placeholder="https://instagram.com/username" />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label fw-black small text-uppercase text-accent mb-3"
                                            style={{ letterSpacing: '0.15em', fontSize: '0.7rem' }}>URUTAN <span
                                                className="text-danger">*</span></label>
                                        <input type="number" name="urutan"
                                            className="form-control admin-input"
                                            value={formData.urutan}
                                            onChange={(e) => setFormData({ ...formData, urutan: e.target.value })}
                                            required />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label fw-black small text-uppercase text-accent mb-3"
                                            style={{ letterSpacing: '0.15em', fontSize: '0.7rem' }}>STATUS <span
                                                className="text-danger">*</span></label>
                                        <select name="status" className="form-select admin-select"
                                            value={formData.status || 'active'}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            required>
                                            <option value="active">AKTIF</option>
                                            <option value="inactive">NON-AKTIF</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-black small text-uppercase text-accent mb-3"
                                            style={{ letterSpacing: '0.15em', fontSize: '0.7rem' }}>FOTO PROFIL</label>
                                        <div className="d-flex align-items-center gap-3">
                                            {formData.foto && (
                                                <img src={formData.foto} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid var(--accent)' }} />
                                            )}
                                            <div className="flex-grow-1">
                                                <input type="file" name="foto"
                                                    className="form-control admin-input"
                                                    accept="image/*"
                                                    onChange={handleUpload}
                                                    disabled={uploading} />
                                            </div>
                                        </div>
                                        {uploading && <div className="mt-2 small text-accent fw-bold"><i className="spinner-border spinner-border-sm me-2"></i> Mengunggah...</div>}
                                        <div className="mt-2 x-small text-white-50 fw-bold">FORMAT: JPG, PNG, WEBP. MAKSIMAL 2MB. VERCEL BLOB ENABLED.</div>
                                    </div>

                                    <div className="col-12 pt-5"
                                        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '3rem' }}>
                                        <div className="d-flex gap-3">
                                            <button type="submit" className="btn btn-accent px-5 py-3 fw-black" disabled={loading || uploading}>
                                                <i className="bi bi-save2-fill me-2"></i> {loading ? 'MENYIMPAN...' : 'SIMPAN DATA'}
                                            </button>
                                            <button type="button" onClick={() => navigate('/dashboard/pengurus')}
                                                className="btn btn-dark px-5 py-3 fw-black border-0 rounded-0"
                                                style={{ background: 'rgba(255,255,255,0.05)' }}>BATAL</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OfficerForm
