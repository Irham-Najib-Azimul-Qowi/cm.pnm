import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AOS from 'aos'
import { useParams, Link } from 'react-router-dom'

const ArticleDetail = () => {
    const { slug } = useParams()
    const [artikel, setArtikel] = useState(null)
    const [related, setRelated] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`/api/articles/\${slug}`)
                setArtikel(res.data)

                // Fetch related (random or latest excluding current)
                const relatedRes = await axios.get('/api/articles?per_page=4')
                setRelated(relatedRes.data.data?.filter(a => a.id !== res.data.id) || [])
            } catch (error) {
                console.error('Error fetching article detail:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDetail()
    }, [slug])

    if (loading) return (
        <div className="section-shell text-center py-5 bg-dark">
            <div className="spinner-border text-accent" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )

    if (!artikel) return (
        <div className="section-shell text-center py-5 bg-dark text-white">
            <h2 className="fw-bold">Artikel Tidak Ditemukan</h2>
            <Link to="/artikel" className="btn-join-premium mt-4">Kembali ke Daftar</Link>
        </div>
    )

    return (
        <div className="page-article-detail bg-dark text-white overflow-hidden">
            <section className="section-shell" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
                <div className="container">
                    <div className="article-layout">
                        <article className="article-main" data-aos="fade-up">
                            <div className="article-main__body">
                                <nav className="article-breadcrumb">
                                    <Link to="/">Beranda</Link>
                                    <span>/</span>
                                    <Link to="/artikel">Artikel</Link>
                                    <span>/</span>
                                    <span style={{ color: '#fff' }}>Baca Tulisan</span>
                                </nav>

                                <header className="article-head">
                                    <h1 className="article-head__title">{artikel.judul}</h1>
                                    <div className="article-head__meta">
                                        <div className="article-meta-item">
                                            <div className="article-author__badge">{artikel.user?.name?.charAt(0).toUpperCase()}</div>
                                            <span>{artikel.user?.name}</span>
                                        </div>
                                        <div className="article-meta-item">
                                            <i className="bi bi-calendar3"></i>
                                            <span>{new Date(artikel.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <div className="article-meta-item">
                                            <i className="bi bi-eye"></i>
                                            <span>{artikel.views} Views</span>
                                        </div>
                                    </div>

                                    {artikel.excerpt && (
                                        <div className="article-summary">
                                            {artikel.excerpt}
                                        </div>
                                    )}
                                </header>

                                {artikel.gambar_utama && (
                                    <figure className="article-figure">
                                        <img src={artikel.gambar_utama} alt={artikel.judul} />
                                        <figcaption>Dokumentasi: {artikel.judul}</figcaption>
                                    </figure>
                                )}

                                <div className="article-content" dangerouslySetInnerHTML={{ __html: artikel.konten }}></div>

                                <div className="article-share-bar">
                                    <h2>Bagikan Tulisan</h2>
                                    <div className="article-share-actions">
                                        <a href={`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="article-share-action">
                                            <i className="bi bi-facebook"></i> Facebook
                                        </a>
                                        <a href={`https://twitter.com/intent/tweet?url=\${encodeURIComponent(window.location.href)}&text=\${encodeURIComponent(artikel.judul)}`} target="_blank" rel="noopener noreferrer" className="article-share-action">
                                            <i className="bi bi-twitter-x"></i> Twitter
                                        </a>
                                        <a href={`https://wa.me/?text=\${encodeURIComponent(artikel.judul + ' - ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="article-share-action">
                                            <i className="bi bi-whatsapp"></i> WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <aside className="article-sidebar">
                            {related.length > 0 && (
                                <div className="article-sidebar-card" data-aos="fade-up" data-aos-delay="100">
                                    <h2>Lainnya</h2>
                                    <div className="article-related-list">
                                        {related.map(rel => (
                                            <Link to={`/artikel/\${rel.slug}`} className="article-related-item" key={rel.id}>
                                                <div className="article-related-item__media">
                                                    <img src={rel.gambar_utama || '/image/fotobersejarah2.jpg'} alt={rel.judul} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h3 className="article-related-item__title">{rel.judul}</h3>
                                                    <div className="article-related-item__meta">{new Date(rel.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="article-sidebar-card shadow-lg" data-aos="fade-up" data-aos-delay="150" style={{ background: 'var(--dark-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h2>Eksplorasi</h2>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.8 }}>
                                    Kembali ke arsip untuk menemukan wawasan dan kisah perjalanan lainnya dari Cakra Manggala.
                                </p>
                                <Link to="/artikel" className="article-sidebar-action">
                                    <i className="bi bi-collection-fill me-2"></i> Semua Artikel
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ArticleDetail
