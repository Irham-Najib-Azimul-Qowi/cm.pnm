import React, { useState } from 'react'
import axios from 'axios'
import AOS from 'aos'

const Contact = () => {
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        subjek: '',
        pesan: ''
    })
    const [status, setStatus] = useState({ loading: false, success: null, error: null })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, success: null, error: null })
        try {
            await axios.post('/api/pesan', formData)
            setStatus({ loading: false, success: 'Pesan Anda telah terkirim! Terima kasih.', error: null })
            setFormData({ nama: '', email: '', subjek: '', pesan: '' })
        } catch (error) {
            console.error('Error sending message:', error)
            setStatus({ loading: false, success: null, error: 'Gagal mengirim pesan. Silakan coba lagi.' })
        }
    }

    return (
        <div className="page-contact overflow-hidden text-white">
            <section className="page-hero" style={{ backgroundImage: "linear-gradient(rgba(7, 17, 12, 0.7), rgba(7, 17, 12, 0.7)), url('/image/fotobersejarah2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container">
                    <div className="page-hero__inner">
                        <span className="page-hero__eyebrow" data-aos="fade-up">
                            <i className="bi bi-chat-left-text me-2"></i>
                            Komunikasi
                        </span>
                        <h1 className="page-hero__title" data-aos="fade-up" data-aos-delay="100">Hubungi Kami</h1>
                        <p className="page-hero__lead" data-aos="fade-up" data-aos-delay="200">
                            Ada pertanyaan atau ingin berkolaborasi? Kami siap mendengar dan merespons pesan Anda.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="section-shell" style={{ backgroundColor: 'var(--dark-color)' }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4" data-aos="fade-up">
                            <div className="premium-card p-5 text-center h-100" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '60px', height: '60px', background: 'var(--accent-color)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 2rem' }}>
                                    <i className="bi bi-geo-alt-fill"></i>
                                </div>
                                <h3 className="h5 fw-bold text-white mb-3" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sekretariat</h3>
                                <div style={{ width: '40px', height: '2px', background: 'var(--accent-color)', margin: '0 auto 1.5rem' }}></div>
                                <p className="mb-0 text-white-50" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    Gedung Perkuliahan Kampus 1, Lantai 1<br />
                                    Politeknik Negeri Madiun<br />
                                    Jl. Serayu No.84, Kota Madiun
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                            <div className="premium-card p-5 text-center h-100" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '60px', height: '60px', background: 'var(--accent-color)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 2rem' }}>
                                    <i className="bi bi-envelope-fill"></i>
                                </div>
                                <h3 className="h5 fw-bold text-white mb-3" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Korespondensi</h3>
                                <div style={{ width: '40px', height: '2px', background: 'var(--accent-color)', margin: '0 auto 1.5rem' }}></div>
                                <a href="mailto:sekretariat.cakramanggala@pnm.ac.id" className="text-decoration-none fw-bold text-accent">sekretariat.cakramanggala@pnm.ac.id</a>
                                <p className="mt-3 mb-0 text-white-50 small">Kirimkan surat elektronik untuk keperluan formal atau kerjasama.</p>
                            </div>
                        </div>
                        <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
                            <div className="premium-card p-5 text-center h-100" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '60px', height: '60px', background: 'var(--accent-color)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 2rem' }}>
                                    <i className="bi bi-instagram"></i>
                                </div>
                                <h3 className="h5 fw-bold text-white mb-3" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sosial Media</h3>
                                <div style={{ width: '40px', height: '2px', background: 'var(--accent-color)', margin: '0 auto 1.5rem' }}></div>
                                <a href="https://instagram.com/cakramanggala.pnm" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-bold text-accent" style={{ fontSize: '1.1rem' }}>@cakramanggala.pnm</a>
                                <p className="mt-3 mb-0 text-white-50 small">Dapatkan info terupdate dan dokumentasi dokumentasi terbaru melalui Instagram.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="section-shell" style={{ backgroundColor: 'var(--primary-color)' }}>
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-7" data-aos="fade-right">
                            <div className="premium-card p-5" style={{ background: 'var(--dark-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h2 className="h3 fw-bold text-white mb-2">Kirim Pesan</h2>
                                <p className="text-white-50 mb-5">Kami akan membalas pesan Anda sesegera mungkin.</p>

                                {status.success && (
                                    <div className="alert alert-success border-0 rounded-0 p-4 mb-4" style={{ background: 'var(--accent-color)', color: 'var(--primary-color)', fontWeight: 700 }}>
                                        <i className="bi bi-check-circle-fill me-2"></i> {status.success}
                                    </div>
                                )}
                                {status.error && (
                                    <div className="alert alert-danger border-0 rounded-0 p-4 mb-4" style={{ background: '#ff6b6b', color: '#fff', fontWeight: 700 }}>
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i> {status.error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-white-50 text-uppercase">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                className="form-control bg-transparent py-3 text-white rounded-0"
                                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                                placeholder="Nama Anda"
                                                value={formData.nama}
                                                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-white-50 text-uppercase">Email</label>
                                            <input
                                                type="email"
                                                className="form-control bg-transparent py-3 text-white rounded-0"
                                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                                placeholder="email@contoh.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-white-50 text-uppercase">Subjek</label>
                                            <input
                                                type="text"
                                                className="form-control bg-transparent py-3 text-white rounded-0"
                                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                                placeholder="Topik pembicaraan"
                                                value={formData.subjek}
                                                onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-white-50 text-uppercase">Pesan</label>
                                            <textarea
                                                rows="5"
                                                className="form-control bg-transparent py-3 text-white rounded-0"
                                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                                placeholder="Tuliskan pesan Anda..."
                                                value={formData.pesan}
                                                onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-12 mt-5">
                                            <button
                                                type="submit"
                                                className="btn-join-premium w-100 py-3 rounded-0"
                                                style={{ padding: '1.2rem', fontSize: '0.95rem' }}
                                                disabled={status.loading}
                                            >
                                                {status.loading ? 'MENGIRIM...' : 'KIRIM PESAN'} <i className="bi bi-send-fill ms-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-5" data-aos="fade-left">
                            <div className="premium-card overflow-hidden h-100 shadow-sm rounded-0" style={{ border: '1px solid rgba(255,255,255,0.05)', minHeight: '500px' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.5123984871954!2d111.535032!3d-7.632296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79be96f6a7d3ef%3A0xe541e204c3cf7b52!2sPoliteknik%20Negeri%20Madiun!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                                    width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(0.9) opacity(0.8)' }}
                                    allowFullScreen="" loading="lazy" title="Location Map"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact
