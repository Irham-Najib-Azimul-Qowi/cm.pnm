import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import AOS from 'aos'

const Home = () => {
    const [kegiatans, setKegiatans] = useState([])
    const [artikels, setArtikels] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kegiatanRes, artikelRes] = await Promise.all([
                    axios.get('/api/kegiatan?limit=3'),
                    axios.get('/api/articles?per_page=3')
                ])
                setKegiatans(kegiatanRes.data || [])
                setArtikels(artikelRes.data.data || [])
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="page-home overflow-hidden">
            {/* Hero Section */}
            <section className="page-hero home-hero" id="homeHero">
                <div className="page-hero__media" aria-hidden="true">
                    <div
                        className="page-hero__fallback"
                        style={{
                            backgroundImage: "url('/image/fotobersejarah2.jpg')",
                            position: "absolute",
                            inset: "-4%",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "saturate(0.9) contrast(1.1)",
                            transform: "scale(1.05)"
                        }}
                    ></div>
                    <video
                        className="home-hero__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center bottom",
                            opacity: 1,
                            transition: "opacity 1s ease-in-out"
                        }}
                    >
                        <source src="/videos/cinematic.mp4" type="video/mp4" />
                    </video>
                </div>

                <div className="container">
                    <div className="page-hero__inner text-center mx-auto">
                        <h1 className="page-hero__title" data-aos="fade-up" data-aos-delay="100">
                            Mendaki Tinggi,<br />
                            <span>Menjaga Bumi</span>
                        </h1>
                        <p className="page-hero__lead mx-auto" data-aos="fade-up" data-aos-delay="200">
                            Wadah pembentukan karakter melalui alam bebas untuk mereka yang berani melangkah lebih jauh.
                        </p>
                        <div className="mt-5" data-aos="fade-up" data-aos-delay="300">
                            <Link to="/bergabung" className="btn-join-premium">
                                Mulai Petualangan <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Activities Section */}
            <section className="section-shell" style={{ backgroundColor: "var(--dark-color)", color: "#fff" }}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-5" data-aos="fade-up">
                        <div>
                            <span className="section-label" style={{ color: "var(--accent-color)" }}>Dokumentasi</span>
                            <h2 className="section-heading mb-0" style={{ color: "#fff" }}>Agenda & Kegiatan</h2>
                        </div>
                        <Link to="/kegiatan" className="btn-premium-link d-none d-md-inline-flex">Lihat Semua <i className="bi bi-arrow-right"></i></Link>
                    </div>

                    <div className="row g-4">
                        {kegiatans.map((kegiatan, index) => (
                            <div className="col-lg-4" key={kegiatan.id} data-aos="fade-up" data-aos-delay={index * 100}>
                                <article className="doc-card">
                                    <div className="doc-card__img-container">
                                        <img
                                            src={kegiatan.gambar_utama || '/image/fotobersejarah1.jpg'}
                                            alt={kegiatan.judul_kegiatan}
                                            className="doc-card__img"
                                        />
                                        <div className="doc-card__overlay"></div>
                                    </div>
                                    <div className="doc-card__content">
                                        <span className="doc-card__tag">{kegiatan.sifat}</span>
                                        <span className="doc-card__date">
                                            {new Date(kegiatan.tanggal_pelaksanaan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} — {kegiatan.tempat}
                                        </span>
                                        <h3 className="doc-card__title">{kegiatan.judul_kegiatan}</h3>
                                        <div className="doc-card__excerpt">
                                            {kegiatan.materi && kegiatan.materi.substring(0, 120)}...
                                        </div>
                                        <Link to="/kegiatan" className="doc-card__link">
                                            Buka Detail <i className="bi bi-plus-lg"></i>
                                        </Link>
                                    </div>
                                </article>
                            </div>
                        ))}
                        {!loading && kegiatans.length === 0 && (
                            <div className="col-12 text-center py-5">
                                <p className="text-white-50">Belum ada data kegiatan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Articles Section */}
            <section className="section-shell" style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}>
                <div className="container">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <span className="section-label" style={{ color: "var(--accent-color)" }}>Literasi</span>
                        <h2 className="section-heading" style={{ color: "#fff" }}>Artikel & Catatan</h2>
                        <div className="mx-auto mt-3" style={{ width: "80px", height: "1px", background: "rgba(255,255,255,0.2)" }}></div>
                    </div>

                    <div className="row g-4">
                        {artikels.map((artikel, index) => (
                            <div className="col-lg-4" key={artikel.id} data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="art-card">
                                    <div className="art-card__img-wrap">
                                        <img
                                            src={artikel.gambar_utama || '/image/fotobersejarah2.jpg'}
                                            alt={artikel.judul}
                                            className="art-card__img"
                                        />
                                        <span className="position-absolute top-0 end-0 bg-accent text-primary px-3 py-1 fw-bold x-small" style={{ background: "var(--accent-color)", color: "var(--primary-color)", zIndex: 5 }}>
                                            ARTIKEL
                                        </span>
                                    </div>
                                    <div className="art-card__body">
                                        <div className="premium-card__meta mb-3">
                                            <span><i className="bi bi-person me-2"></i>{artikel.user?.name}</span>
                                            <span className="ms-3"><i className="bi bi-eye me-2"></i>{artikel.views}</span>
                                        </div>
                                        <h3 className="premium-card__title">{artikel.judul}</h3>
                                        <p className="premium-card__text">
                                            {artikel.excerpt || (artikel.konten && artikel.konten.substring(0, 100).replace(/<[^>]*>?/gm, ''))}
                                        </p>
                                        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                            <Link to={`/artikel/${artikel.slug}`} className="btn-premium-link">Baca Selengkapnya <i className="bi bi-arrow-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!loading && artikels.length === 0 && (
                            <div className="col-12 text-center py-5">
                                <p className="text-white-50">Belum ada artikel terbaru.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Join CTA Section */}
            <section className="section-shell p-0" style={{ backgroundColor: "var(--dark-color)" }}>
                <div className="join-cta-card" style={{
                    border: "none",
                    padding: "10rem 2rem",
                    background: "linear-gradient(rgba(7, 17, 12, 0.85), rgba(7, 17, 12, 0.85)), url('/image/fotobersejarah2.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed"
                }}>
                    <div className="container">
                        <div data-aos="fade-up">
                            <span className="section-label" style={{ color: "var(--accent-color)", marginBottom: "2rem" }}>Kesempatan Bergabung</span>
                            <h2 className="join-cta-title" style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", lineHeight: 1.1, marginBottom: "2.5rem" }}>
                                Terlahir untuk<br /><span style={{ color: "var(--accent-color)" }}>Menjadi Legenda</span>
                            </h2>
                            <p className="join-cta-desc" style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.7)", marginBottom: "4rem" }}>
                                Jadilah bagian dari Angkatan XIV Cakra Manggala. Tempa mental, fisik, dan karaktermu dalam dekapan alam.
                            </p>
                            <Link to="/bergabung" className="btn-join-premium" style={{ fontSize: "1rem", padding: "1.5rem 4rem" }}>
                                Gabung Sekarang <i className="bi bi-chevron-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
