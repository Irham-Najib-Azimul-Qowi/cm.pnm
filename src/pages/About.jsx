import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AOS from 'aos'

const About = () => {
    const [pengurus, setPengurus] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPengurus = async () => {
            try {
                const res = await axios.get('/api/pengurus')
                setPengurus(res.data || [])
            } catch (error) {
                console.error('Error fetching pengurus:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPengurus()
    }, [])

    const values = [
        { icon: 'bi-shield-shaded', title: 'Integritas', desc: 'Menjunjung tinggi kejujuran dalam setiap tindakan.' },
        { icon: 'bi-lightning-charge-fill', title: 'Ketangguhan', desc: 'Kuat menghadapi tantangan di setiap medan.' },
        { icon: 'bi-people-fill', title: 'Solidaritas', desc: 'Satu rasa, satu jiwa, dalam satu keluarga.' },
        { icon: 'bi-flower1', title: 'Lestari', desc: 'Bertanggung jawab penuh atas kelestarian bumi.' },
    ]

    return (
        <div className="page-about overflow-hidden">
            <section className="page-hero" style={{ backgroundImage: "linear-gradient(rgba(7, 17, 12, 0.7), rgba(7, 17, 12, 0.7)), url('/image/fotobersejarah2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container">
                    <div className="page-hero__inner">
                        <span className="page-hero__eyebrow" data-aos="fade-up">
                            <i className="bi bi-info-circle me-2"></i>
                            Jati Diri
                        </span>
                        <h1 className="page-hero__title" data-aos="fade-up" data-aos-delay="100">
                            Mengenal<br /><span>Cakra Manggala</span>
                        </h1>
                        <p className="page-hero__lead" data-aos="fade-up" data-aos-delay="200">
                            Wadah pembentukan karakter mahasiswa melalui petualangan dan kepedulian lingkungan yang telah berdiri sejak 2013.
                        </p>
                    </div>
                </div>
            </section>

            {/* History Section */}
            <section className="section-shell" style={{ backgroundColor: 'var(--dark-color)', color: '#fff' }}>
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6" data-aos="fade-right">
                            <div className="position-relative" style={{ border: '1px solid var(--accent-color)', padding: '1rem' }}>
                                <img src="/image/fotobersejarah1.jpg" alt="Sejarah" className="img-fluid" style={{ filter: 'grayscale(0.2) contrast(1.1)' }} />
                                <div className="position-absolute bottom-0 end-0 p-4 fw-bold" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--primary-color)' }}>
                                    EST. 2013
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6" data-aos="fade-left">
                            <span className="section-label" style={{ color: 'var(--accent-color)' }}>Latar Belakang</span>
                            <h2 className="section-heading" style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Tumbuh dari Semangat Kebersamaan</h2>
                            <div style={{ width: '60px', height: '4px', background: 'var(--accent-color)', marginBottom: '2rem' }}></div>
                            <p className="section-lead" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                Cakra Manggala lahir di Politeknik Negeri Madiun dari sekelompok mahasiswa yang memiliki mimpi besar: menyatukan petualangan dengan tanggung jawab sosial dan lingkungan.
                            </p>
                            <div className="mt-5">
                                <div className="d-flex gap-4 mb-4" style={{ borderLeft: '3px solid var(--accent-color)', paddingLeft: '1.5rem' }}>
                                    <div>
                                        <h4 className="h5 fw-bold" style={{ color: 'var(--accent-color)', letterSpacing: '0.05em' }}>Inisiasi Awal</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 0 }}>Dimulai dengan nama Gemapala sebagai awal gerakan di lingkungan kampus.</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-4" style={{ borderLeft: '3px solid var(--accent-color)', paddingLeft: '1.5rem' }}>
                                    <div>
                                        <h4 className="h5 fw-bold" style={{ color: 'var(--accent-color)', letterSpacing: '0.05em' }}>Transformasi 2014</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 0 }}>Resmi menggunakan nama Cakra Manggala untuk memperkuat identitas organisasi.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="section-shell" style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}>
                <div className="container">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <span className="section-label" style={{ color: 'var(--accent-color)' }}>Arah Gerak</span>
                        <h2 className="section-heading" style={{ color: '#fff' }}>Visi & Misi Kami</h2>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-6" data-aos="fade-up">
                            <div className="premium-card p-5 h-100" style={{ background: 'var(--dark-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '50px', height: '50px', background: 'var(--accent-color)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', font_size: '1.5rem', marginBottom: '2rem' }}>
                                    <i className="bi bi-eye-fill"></i>
                                </div>
                                <h3 className="h2 fw-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Visi</h3>
                                <p className="mb-0" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                                    Menjadi organisasi yang mengembangkan intelektualitas, jasmani, dan rohani serta menumbuhkan kesadaran terhadap alam, sehingga menjadi panutan bagi mahasiswa dan masyarakat.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
                            <div className="premium-card p-5 h-100" style={{ background: 'var(--dark-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '50px', height: '50px', background: 'var(--accent-color)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '2rem' }}>
                                    <i className="bi bi-list-check"></i>
                                </div>
                                <h3 className="h2 fw-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Misi</h3>
                                <ul className="list-unstyled d-grid gap-4">
                                    <li className="d-flex gap-3">
                                        <i className="bi bi-shield-fill-check" style={{ color: 'var(--accent-color)' }}></i>
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Menyelenggarakan pembinaan karakter yang disiplin dan bertanggung jawab.</span>
                                    </li>
                                    <li className="d-flex gap-3">
                                        <i className="bi bi-shield-fill-check" style={{ color: 'var(--accent-color)' }}></i>
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Meningkatkan keterampilan teknis dalam aktivitas alam bebas.</span>
                                    </li>
                                    <li className="d-flex gap-3">
                                        <i className="bi bi-shield-fill-check" style={{ color: 'var(--accent-color)' }}></i>
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Melaksanakan aksi nyata dalam pelestarian lingkungan hidup.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-shell" style={{ backgroundColor: 'var(--dark-color)', color: '#fff' }}>
                <div className="container">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <span className="section-label" style={{ color: 'var(--accent-color)' }}>Nilai Luhur</span>
                        <h2 className="section-heading" style={{ color: '#fff' }}>Pilar Karakter</h2>
                    </div>
                    <div className="row g-4">
                        {values.map((val, index) => (
                            <div className="col-sm-6 col-lg-3" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="premium-card text-center p-5 h-100" style={{ border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                    <i className={`${val.icon} display-5 mb-4`} style={{ color: 'var(--accent-color)' }}></i>
                                    <h4 className="h5 fw-bold text-white mb-3" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        {val.title}
                                    </h4>
                                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{val.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="section-shell" style={{ backgroundColor: 'var(--primary-color)', color: '#fff', paddingBottom: '10rem' }}>
                <div className="container">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <span className="section-label" style={{ color: 'var(--accent-color)' }}>Organisasi</span>
                        <h2 className="section-heading" style={{ color: '#fff' }}>Pengurus Inti</h2>
                        <p className="section-lead mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            Dedikasi pengurus Cakra Manggala periode aktif.
                        </p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-9">
                            <div className="officer-stack gap-4 d-flex flex-column">
                                {pengurus.map((p, index) => (
                                    <div className="officer-horizontal-card" key={p.id} data-aos="fade-up" data-aos-delay={index * 50}>
                                        <div className="oh-card__inner">
                                            <div className="oh-card__photo">
                                                {p.foto ? (
                                                    <img src={p.foto} alt={p.nama} />
                                                ) : (
                                                    <div className="oh-card__placeholder">
                                                        {p.nama.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="oh-card__content">
                                                <div className="oh-card__header">
                                                    <span className="oh-card__position">{p.jabatan.toUpperCase()}</span>
                                                    <h3 className="oh-card__name">{p.nama}</h3>
                                                    {p.prodi_semester && (
                                                        <p className="x-small text-accent mt-1 mb-0 fw-bold">
                                                            {p.prodi_semester.toUpperCase()}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="oh-card__footer">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                                                        <span className="x-small text-white-50 fw-bold">PENGURUS AKTIF</span>
                                                    </div>
                                                    {p.instagram_url && (
                                                        <a href={p.instagram_url} target="_blank" rel="noopener noreferrer" className="oh-card__social">
                                                            <i className="bi bi-instagram"></i>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-accent" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                {!loading && pengurus.length === 0 && (
                                    <div className="text-center py-5 bg-white-10">
                                        <p className="text-white-50 mb-0">Belum ada data pengurus tersedia.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
