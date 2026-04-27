import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const ArticleForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = !!id

    const [formData, setFormData] = useState({
        judul: '',
        slug: '',
        excerpt: '',
        konten: '',
        gambar_utama: '',
        status: 'draft'
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isEdit) {
            const fetchDetail = async () => {
                try {
                    // Note: Detail by ID needed. My current detail endpoint is by slug.
                    // I need an endpoint for detail by ID for admin.
                    // I created api/admin/articles/[id]/index.go which handles PUT but not GET.
                    // I'll update it to handle GET too.
                    const token = localStorage.getItem('token')
                    const res = await axios.get(`/api/admin/articles?id=${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setFormData(res.data)
                } catch (error) {
                    console.error('Error fetching article:', error)
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
            if (isEdit) {
                await axios.put(`/api/admin/articles?id=${id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } else {
                await axios.post('/api/admin/articles', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            }
            navigate('/dashboard/artikel')
        } catch (error) {
            alert('Gagal menyimpan artikel: ' + (error.response?.data?.error || error.message))
        } finally {
            setLoading(false)
        }
    }

    const generateSlug = () => {
        const slug = formData.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        setFormData({ ...formData, slug })
    }

    return (
        <div className="p-4 p-md-5">
            <div className="mb-5">
                <h1 className="h2 fw-bold text-white mb-1">{isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h1>
                <p className="text-white-50 small">Buat konten informatif untuk seluruh pembaca.</p>
            </div>

            <form onSubmit={handleSubmit} className="row g-4">
                <div className="col-lg-8">
                    <div className="p-4 bg-dark h-100" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-white-50 text-uppercase">Judul Artikel</label>
                            <input
                                type="text"
                                className="form-control bg-transparent py-3 text-white rounded-0"
                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                value={formData.judul}
                                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                onBlur={generateSlug}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-white-50 text-uppercase">Slug (URL)</label>
                            <input
                                type="text"
                                className="form-control bg-transparent py-2 text-white rounded-0 opacity-75"
                                style={{ border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem' }}
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-white-50 text-uppercase">Ringkasan (Excerpt)</label>
                            <textarea
                                className="form-control bg-transparent py-3 text-white rounded-0"
                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                rows="3"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="mb-0">
                            <label className="form-label small fw-bold text-white-50 text-uppercase">Konten Lengkap</label>
                            <div className="bg-white text-dark rounded-0 overflow-hidden">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.konten}
                                    onChange={(val) => setFormData({ ...formData, konten: val })}
                                    style={{ height: '400px', marginBottom: '45px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="p-4 bg-dark" style={{ border: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: '2rem' }}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-white-50 text-uppercase">Status Publikasi</label>
                            <select
                                className="form-select bg-dark text-white rounded-0 py-3"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="draft">DRAFT</option>
                                <option value="published">PUBLISHED</option>
                            </select>
                        </div>

                        <div className="mb-5">
                            <label className="form-label small fw-bold text-white-50 text-uppercase">URL Gambar Utama</label>
                            <input
                                type="text"
                                className="form-control bg-transparent py-2 text-white rounded-0"
                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                placeholder="https://..."
                                value={formData.gambar_utama}
                                onChange={(e) => setFormData({ ...formData, gambar_utama: e.target.value })}
                            />
                            {formData.gambar_utama && (
                                <div className="mt-3 overflow-hidden" style={{ height: '150px' }}>
                                    <img src={formData.gambar_utama} alt="Preview" className="w-100 h-100 object-fit-cover" />
                                </div>
                            )}
                        </div>

                        <div className="d-grid gap-3">
                            <button
                                type="submit"
                                className="btn-join-premium py-3 rounded-0 fw-bold"
                                disabled={loading}
                            >
                                {loading ? 'MENYIMPAN...' : 'SIMPAN ARTIKEL'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-light rounded-0 py-3 small fw-bold opacity-50"
                                onClick={() => navigate('/dashboard/artikel')}
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

export default ArticleForm
