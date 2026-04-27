import React, { useState } from 'react'
import axios from 'axios'
import AOS from 'aos'
import { Link, useNavigate } from 'react-router-dom'

const Join = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        jenis_kelamin: '',
        no_hp: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        nim: '',
        jurusan: '',
        program_studi: '',
        alamat: '',
        organisasi_yang_pernah_diikuti: '',
        alasan_bergabung: '',
        foto_diri: null,
        konfirmasi: false
    })
    const [status, setStatus] = useState({ loading: false, error: null })

    const steps = [
        { label: 'Identitas', icon: 'bi-person-badge' },
        { label: 'Akademik', icon: 'bi-mortarboard' },
        { label: 'Visi & Misi', icon: 'bi-lightning-charge' },
        { label: 'Konfirmasi', icon: 'bi-check2-circle' },
    ]

    const handleNext = () => setStep(s => s + 1)
    const handlePrev = () => setStep(s => s - 1)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.konfirmasi) {
            setStatus({ loading: false, error: 'Silakan centang konfirmasi data.' })
            return
        }

        setStatus({ loading: true, error: null })
        try {
            // Note: In serverless, handling file uploads requires a storage service (S3, Cloudinary, etc.)
            // For this replication, we'll send it as base64 or just a mock if not handling files yet.
            // Let's assume standard multipart for now.
            const data = new FormData()
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key])
            })

            await axios.post('/api/pendaftaran', formData) // Using JSON for data for now as per Go handler
            alert('Pendaftaran Berhasil! Kami akan menghubungi Anda segera.')
            navigate('/')
        } catch (error) {
            console.error('Error submitting form:', error)
            setStatus({ loading: false, error: error.response?.data?.error || 'Gagal mengirim pendaftaran.' })
        }
    }

    const jurusanOptions = ['Teknik', 'Akuntansi', 'Administrasi Bisnis', 'Teknik Informatika', 'Teknik Mesin', 'Teknik Sipil', 'Teknik Listrik', 'Teknik Kimia']

    return (
        <div className="join-page-wrapper">
            <div className="join-bg-accent"></div>

            <Link to="/" className="btn-back-exit" title="Kembali ke Beranda">
                <i className="bi bi-x-lg"></i>
            </Link>

            <div className="container py-5">
                <div className="join-container mx-auto" style={{ maxWidth: '900px' }}>
                    <header className="join-header text-center mb-5" data-aos="fade-down">
                        <span className="join-header__label text-accent fw-bold d-block mb-3">OPEN RECRUITMENT</span>
                        <h1 className="join-header__title text-white fw-bold">GABUNG CAKRA MANGGALA</h1>
                        <p className="join-header__desc text-white-50">Jadilah bagian dari penjaga rimba dan pengembara cakrawala.</p>
                    </header>

                    <div className="join-stepper d-grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        {steps.map((s, i) => (
                            <div key={i} className={`join-step text-center ${step === i + 1 ? 'is-active' : step > i + 1 ? 'is-complete' : ''}`}>
                                <div className="join-step__icon-box mx-auto mb-2">
                                    <i className={`bi ${s.icon}`}></i>
                                </div>
                                <span className="join-step__label small text-uppercase fw-bold d-block">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="join-card p-4 p-md-5" data-aos="fade-up">
                        {status.error && (
                            <div className="alert alert-danger mb-4 rounded-0 border-0 bg-danger text-white">
                                <i className="bi bi-exclamation-circle me-2"></i> {status.error}
                            </div>
                        )}

                        {/* Step 1: Identitas */}
                        {step === 1 && (
                            <div className="join-panel">
                                <div className="panel-header mb-4">
                                    <h2 className="panel-title text-white h4 fw-bold">Identitas Diri</h2>
                                    <p className="panel-desc text-white-50 small">Gunakan data asli sesuai identitas KTP/KTM.</p>
                                </div>
                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="form-label text-white-50 small fw-bold">Nama Lengkap</label>
                                            <input type="text" className="form-control" placeholder="Ahmad Fauzi" value={formData.nama_lengkap} onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label text-white-50 small fw-bold">Jenis Kelamin</label>
                                            <select className="form-select" value={formData.jenis_kelamin} onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })} required>
                                                <option value="">Pilih...</option>
                                                <option value="Laki-laki">Laki-laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label text-white-50 small fw-bold">Nomor WhatsApp</label>
                                            <input type="tel" className="form-control" placeholder="08xxxxxxxxxx" value={formData.no_hp} onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="join-actions d-flex justify-content-end mt-5">
                                    <button type="button" className="btn-join-next px-5 py-3 fw-bold bg-accent text-primary border-0" onClick={handleNext}>LANJUTKAN</button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Akademik */}
                        {step === 2 && (
                            <div className="join-panel">
                                <div className="panel-header mb-4">
                                    <h2 className="panel-title text-white h4 fw-bold">Data Akademik</h2>
                                    <p className="panel-desc text-white-50 small">Pastikan kamu mahasiswa aktif saat mendaftar.</p>
                                </div>
                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="form-label text-white-50 small fw-bold">NIM</label>
                                            <input type="text" className="form-control" placeholder="201xxxxxx" value={formData.nim} onChange={(e) => setFormData({ ...formData, nim: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label text-white-50 small fw-bold">Jurusan</label>
                                            <select className="form-select" value={formData.jurusan} onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })} required>
                                                <option value="">Pilih Jurusan</option>
                                                {jurusanOptions.map(j => <option key={j} value={j}>{j}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label text-white-50 small fw-bold">Program Studi</label>
                                            <input type="text" className="form-control" placeholder="D4 TI" value={formData.program_studi} onChange={(e) => setFormData({ ...formData, program_studi: e.target.value })} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="join-actions d-flex justify-content-between mt-5">
                                    <button type="button" className="btn-join-prev px-4 py-3 fw-bold border border-white-50 text-white bg-transparent" onClick={handlePrev}>SEBELUMNYA</button>
                                    <button type="button" className="btn-join-next px-5 py-3 fw-bold bg-accent text-primary border-0" onClick={handleNext}>LANJUTKAN</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Visi Misi */}
                        {step === 3 && (
                            <div className="join-panel">
                                <div className="panel-header mb-4">
                                    <h2 className="panel-title text-white h4 fw-bold">Motivasi & Visi</h2>
                                    <p className="panel-desc text-white-50 small">Tunjukkan semangat pengembaraanmu.</p>
                                </div>
                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="form-label text-white-50 small fw-bold">Alasan Bergabung</label>
                                            <textarea className="form-control" rows="4" placeholder="Kenapa ingin bergabung?" value={formData.alasan_bergabung} onChange={(e) => setFormData({ ...formData, alasan_bergabung: e.target.value })} required></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="join-actions d-flex justify-content-between mt-5">
                                    <button type="button" className="btn-join-prev px-4 py-3 fw-bold border border-white-50 text-white bg-transparent" onClick={handlePrev}>SEBELUMNYA</button>
                                    <button type="button" className="btn-join-next px-5 py-3 fw-bold bg-accent text-primary border-0" onClick={handleNext}>LANJUTKAN</button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Konfirmasi */}
                        {step === 4 && (
                            <div className="join-panel">
                                <div className="panel-header mb-4">
                                    <h2 className="panel-title text-white h4 fw-bold">Langkah Terakhir</h2>
                                    <p className="panel-desc text-white-50 small">Konfirmasi data pendaftaran.</p>
                                </div>
                                <div className="review-area bg-black bg-opacity-25 p-4 mb-4">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="small text-white-50">Nama</div>
                                            <div className="fw-bold text-white">{formData.nama_lengkap}</div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="small text-white-50">NIM</div>
                                            <div className="fw-bold text-white">{formData.nim}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-check mb-4">
                                    <input className="form-check-input" type="checkbox" checked={formData.konfirmasi} onChange={(e) => setFormData({ ...formData, konfirmasi: e.target.checked })} id="confirmCheck" required />
                                    <label className="form-check-label text-white-50 small" htmlFor="confirmCheck">
                                        Saya menyatakan bahwa seluruh data yang diisi adalah benar dan bersedia mengikuti prosedur yang berlaku.
                                    </label>
                                </div>
                                <div className="join-actions d-flex justify-content-between mt-5">
                                    <button type="button" className="btn-join-prev px-4 py-3 fw-bold border border-white-50 text-white bg-transparent" onClick={handlePrev}>SEBELUMNYA</button>
                                    <button type="submit" className="btn-join-submit px-5 py-3 fw-bold bg-accent text-primary border-0" disabled={status.loading}>
                                        {status.loading ? 'MEMPROSES...' : 'SUBMIT Pendaftaran'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Join
