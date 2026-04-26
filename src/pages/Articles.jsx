import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AOS from 'aos'
import { Link, useSearchParams } from 'react-router-dom'

const Articles = () => {
    const [artikels, setArtikels] = useState([])
    const [meta, setMeta] = useState({})
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()

    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')

    const fetchArticles = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`/api/articles?search=\${search}&page=\${page}&per_page=9`)
            setArtikels(res.data.data || [])
            setMeta(res.data.meta || {})
        } catch (error) {
            console.error('Error fetching articles:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchArticles()
    }, [search, page])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        const term = e.target.search.value
        setSearchParams({ search: term, page: 1 })
    }

    return (
        <div className="page-articles overflow-hidden text-white">
            <section className="page-hero" style={{ backgroundImage: "linear-gradient(rgba(7, 17, 12, 0.7), rgba(7, 17, 12, 0.7)), url('/image/fotobersejarah2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container">
                    <div className="page-hero__inner">
                        <span className="page-hero__eyebrow" data-aos="fade-up">
                            <i className="bi bi-journal-richtext me-2"></i>
                            Koleksi Tulisan
                        </span>
                        <h1 className="page-hero__title" data-aos="fade-up" data-aos-delay="100">Artikel & Catatan Perjalanan</h1>
                        <p className="page-hero__lead" data-aos="fade-up" data-aos-delay="200">
                            Ruang bagi anggota untuk berbagi wawasan, teknis lapangan, hingga laporan eksplorasi alam bebas.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section-shell" style={{ backgroundColor: 'var(--dark-color)', minHeight: '80vh' }}>
                <div className="container">
                    {/* Search Bar */}
                    <div className="row justify-content-center mb-5" data-aos="fade-up">
                        <div className="col-lg-7">
                            <form onSubmit={handleSearchSubmit}>
                                <div className="input-group input-group-lg" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                                    <span className="input-group-text bg-transparent border-0 ps-4">
                                        <i className="bi bi-search" style={{ color: 'var(--accent-color)' }}></i>
                                    </span>
                                    <input
                                        type="text"
                                        name="search"
                                        className="form-control bg-transparent border-0 text-white py-3 shadow-none"
                                        defaultValue={search}
                                        placeholder="Cari topik artikel..."
                                        style={{ fontSize: '1.1rem', letterSpacing: '0.02em' }}
                                    />
                                    <button
                                        className="btn px-4"
                                        type="submit"
                                        style={{ background: 'var(--accent-color)', color: 'var(--primary-color)', borderRadius: 0, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem' }}
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-accent" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : artikels.length > 0 ? (
                        <>
                            <div className="row g-4">
                                {artikels.map((artikel, index) => (
                                    <div className="col-12 col-md-6 col-lg-4" key={artikel.id} data-aos="fade-up" data-aos-delay={(index % 3) * 100}>
                                        <div className="art-card">
                                            <div className="art-card__img-wrap">
                                                <img src={artikel.gambar_utama || '/image/fotobersejarah2.jpg'} alt={artikel.judul} className="art-card__img" />
                                                <span className="art-card__badge">BLOG</span>
                                            </div>
                                            <div className="art-card__body">
                                                <div className="art-card__meta">
                                                    <span><i className="bi bi-calendar3 me-2"></i>{new Date(artikel.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                    <span className="ms-3"><i className="bi bi-person-fill me-2"></i>{artikel.user?.name}</span>
                                                </div>
                                                <h3 className="art-card__title">{artikel.judul}</h3>
                                                <p className="art-card__text">
                                                    {artikel.excerpt || (artikel.konten && artikel.konten.substring(0, 110).replace(/<[^>]*>?/gm, ''))}...
                                                </p>
                                                <div className="art-card__footer">
                                                    <Link to={`/artikel/\${artikel.slug}`} className="art-card__link">
                                                        Baca Lanjut <i className="bi bi-chevron-right"></i>
                                                    </Link>
                                                    <div className="art-card__views">
                                                        <i className="bi bi-eye"></i> {artikel.views}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {meta.last_page > 1 && (
                                <nav className="d-flex justify-content-center mt-5">
                                    <ul className="pagination custom-pagination">
                                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                                            <li key={p} className={`page-item \${p === page ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setSearchParams({ search, page: p })}
                                                >
                                                    {p}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-5" data-aos="fade-up">
                            <div style={{ background: 'rgba(255,255,255,0.05)', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <i className="bi bi-search display-3" style={{ color: 'rgba(255,255,255,0.15)' }}></i>
                            </div>
                            <h3 className="fw-bold">Artikel Tidak Ditemukan</h3>
                            <p className="text-white-50">Maaf, kami tidak menemukan artikel dengan kata kunci "{search}".</p>
                            <button onClick={() => setSearchParams({})} className="btn-join-premium mt-4" style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem' }}>
                                Reset Pencarian
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Articles
