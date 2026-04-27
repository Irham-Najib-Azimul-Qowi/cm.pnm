import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AOS from 'aos'
import { Link, useNavigate } from 'react-router-dom'

const Join = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [fileSelected, setFileSelected] = useState(false)
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
        foto_diri: '',
        konfirmasi: false
    })
    const [status, setStatus] = useState({ loading: false, error: null })

    const steps = [
        { label: 'Identitas', icon: 'bi-person-badge' },
        { label: 'Akademik', icon: 'bi-mortarboard' },
        { label: 'Visi & Misi', icon: 'bi-lightning-charge' },
        { label: 'Konfirmasi', icon: 'bi-check2-circle' },
    ]

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setFileSelected(true)

        // Use Vercel Blob via our upload API
        const data = new FormData()
        data.append('file', file)

        try {
            const res = await axios.post('/api/upload', data)
            setFormData(prev => ({ ...prev, foto_diri: res.data.url }))
        } catch (err) {
            console.error('File upload failed:', err)
            alert('Gagal mengunggah foto. Silakan coba lagi.')
        }
    }

    const handleNext = () => {
        // Simple validation for current panel
        const requiredFields = {
            1: ['nama_lengkap', 'jenis_kelamin', 'no_hp', 'tempat_lahir', 'tanggal_lahir'],
            2: ['nim', 'jurusan', 'program_studi', 'alamat'],
            3: ['alasan_bergabung']
        }

        const fields = requiredFields[currentStep] || []
        const missing = fields.filter(f => !formData[f])

        if (missing.length > 0) {
            alert('Harap isi semua kolom yang wajib diisi.')
            return
        }

        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.konfirmasi) {
            alert('Silakan centang konfirmasi data.')
            return
        }

        setStatus({ loading: true, error: null })
        try {
            await axios.post('/api/pendaftaran', formData)
            alert('Pendaftaran Berhasil! Kami akan menghubungi Anda segera.')
            navigate('/')
        } catch (error) {
            console.error('Error submitting form:', error)
            setStatus({ loading: false, error: 'Gagal mengirim pendaftaran.' })
        }
    }

    const jurusanOptions = ['Teknik', 'Akuntansi', 'Administrasi Bisnis', 'Teknik Informatika', 'Teknik Mesin', 'Teknik Sipil', 'Teknik Listrik', 'Teknik Kimia']

    return (
        <div className="join-page-wrapper">
            <div className="join-bg-accent"></div>

            <Link to="/" className="btn-back-exit" title="Kembali ke Beranda">
                <i className="bi bi-x-lg"></i>
            </Link>

            <div className="container">
                <div className="join-container">
                    <header className="join-header" data-aos="fade-down">
                        <span className="join-header__label">OPEN RECRUITMENT</span>
                        <h1 className="join-header__title">GABUNG CAKRA MANGGALA</h1>
                        <p className="join-header__desc">Jadilah bagian dari penjaga rimba dan pengembara cakrawala.</p>
                    </header>

                    <div className="join-stepper" data-aos="fade-up" data-aos-delay="100">
                        {steps.map((s, i) => (
                            <div key={i} className={`join-step ${currentStep === i + 1 ? 'is-active' : currentStep > i + 1 ? 'is-complete' : ''}`}>
                                <div className="join-step__icon-box">
                                    <i className={`bi ${s.icon}`}></i>
                                </div>
                                <span className="join-step__label">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="join-card" data-aos="fade-up" data-aos-delay="200">
                        {/* PANEL 1: IDENTITAS */}
                        <div className={`join-panel ${currentStep === 1 ? 'is-active' : ''}`}>
                            <div className="panel-header">
                                <h2 className="panel-title">Identitas Diri</h2>
                                <p className="panel-desc">Gunakan data asli sesuai identitas KTP/KTM.</p>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="form-label">Nama Lengkap</label>
                                        <input type="text" name="nama_lengkap" className="form-control" placeholder="Ahmad Fauzi" value={formData.nama_lengkap} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Jenis Kelamin</label>
                                        <select name="jenis_kelamin" className="form-select" value={formData.jenis_kelamin} onChange={handleInputChange} required>
                                            <option value="">Pilih...</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Nomor WhatsApp</label>
                                        <input type="tel" name="no_hp" className="form-control" placeholder="08xxxxxxxxxx" value={formData.no_hp} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Tempat Lahir</label>
                                        <input type="text" name="tempat_lahir" className="form-control" placeholder="Kota Kelahiran" value={formData.tempat_lahir} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Tanggal Lahir</label>
                                        <input type="date" name="tanggal_lahir" className="form-control" value={formData.tanggal_lahir} onChange={handleInputChange} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PANEL 2: AKADEMIK */}
                        <div className={`join-panel ${currentStep === 2 ? 'is-active' : ''}`}>
                            <div className="panel-header">
                                <h2 className="panel-title">Data Akademik</h2>
                                <p className="panel-desc">Pastikan kamu mahasiswa aktif saat mendaftar.</p>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="form-label">Nomor Induk Mahasiswa (NIM)</label>
                                        <input type="text" name="nim" className="form-control" placeholder="201xxxxxxx" value={formData.nim} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Jurusan</label>
                                        <select name="jurusan" className="form-select" value={formData.jurusan} onChange={handleInputChange} required>
                                            <option value="">Pilih Jurusan</option>
                                            {jurusanOptions.map(j => <option key={j} value={j}>{j}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Program Studi</label>
                                        <input type="text" name="program_studi" className="form-control" placeholder="Contoh: D4 Teknik Informatika" value={formData.program_studi} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="form-label">Alamat di Madiun (Kos/Rumah)</label>
                                        <textarea name="alamat" className="form-control" placeholder="Jl. Serayu No. xxx..." rows="3" value={formData.alamat} onChange={handleInputChange} required></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PANEL 3: VISI MISI */}
                        <div className={`join-panel ${currentStep === 3 ? 'is-active' : ''}`}>
                            <div className="panel-header">
                                <h2 className="panel-title">Motivasi & Visi</h2>
                                <p className="panel-desc">Tunjukkan semangat pengembaraanmu.</p>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="form-label">Pengalaman Organisasi (Opsional)</label>
                                        <textarea name="organisasi_yang_pernah_diikuti" className="form-control" placeholder="Sebutkan organisasi yang pernah kamu ikuti..." rows="3" value={formData.organisasi_yang_pernah_diikuti} onChange={handleInputChange}></textarea>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label className="form-label">Alasan Bergabung</label>
                                        <textarea name="alasan_bergabung" className="form-control" placeholder="Kenapa kamu ingin bergabung dengan Cakra Manggala?" rows="4" value={formData.alasan_bergabung} onChange={handleInputChange} required></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PANEL 4: KONFIRMASI */}
                        <div className={`join-panel ${currentStep === 4 ? 'is-active' : ''}`}>
                            <div className="panel-header">
                                <h2 className="panel-title">Langkah Terakhir</h2>
                                <p className="panel-desc">Unggah foto dan konfirmasi data pendaftaran.</p>
                            </div>
                            <div className="row g-3">
                                <div className="col-12">
                                    <div className="form-group mb-4">
                                        <label className="form-label">Unggah Foto Diri</label>
                                        <label htmlFor="foto_diri" className="upload-zone w-100">
                                            <span className="upload-icon"><i className="bi bi-camera"></i></span>
                                            <p className="fw-bold mb-1">KLIK UNTUK UNGGAH FOTO</p>
                                            <p className="small text-white-50">Format JPG/PNG, Maksimal 2MB</p>
                                            <input type="file" id="foto_diri" hidden accept="image/*" onChange={handleFileChange} />
                                            {fileSelected && (
                                                <div className="mt-2 text-accent fw-bold">
                                                    <i className="bi bi-check-circle-fill"></i> Foto terpilih
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="review-item">
                                        <div className="review-label">Pendaftar</div>
                                        <div className="review-value">{formData.nama_lengkap || '-'}</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="review-item">
                                        <div className="review-label">NIM</div>
                                        <div className="review-value">{formData.nim || '-'}</div>
                                    </div>
                                </div>
                                <div className="col-12 mt-4">
                                    <div className="form-check d-flex gap-3 p-0">
                                        <input className="form-check-input flex-shrink-0" type="checkbox" name="konfirmasi" checked={formData.konfirmasi} onChange={handleInputChange} id="konfirmasi" required style={{ width: '20px', height: '20px', margin: 0 }} />
                                        <label className="form-check-label small text-white-50" htmlFor="konfirmasi">
                                            Saya menyatakan bahwa seluruh data yang diisi adalah benar dan bersedia mengikuti prosedur yang berlaku.
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="join-actions">
                            <button type="button" className="btn-join-nav btn-join-prev" onClick={handlePrev} style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}>
                                <i className="bi bi-arrow-left"></i> SEBELUMNYA
                            </button>
                            <div>
                                {currentStep < 4 ? (
                                    <button type="button" className="btn-join-nav btn-join-next" onClick={handleNext}>
                                        LANJUTKAN <i className="bi bi-arrow-right"></i>
                                    </button>
                                ) : (
                                    <button type="submit" className="btn-join-nav btn-join-submit" disabled={status.loading}>
                                        {status.loading ? 'MEMPROSES...' : 'SUBMIT FORM'} <i className="bi bi-shield-check"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Join
