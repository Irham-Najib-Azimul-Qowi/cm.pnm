import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useSearchParams } from 'react-router-dom'
import AOS from 'aos'

const Activities = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [kegiatans, setKegiatans] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [yearFilter, setYearFilter] = useState(searchParams.get('tahun') || '')
    const [typeFilter, setTypeFilter] = useState(searchParams.get('sifat') || '')

    useEffect(() => {
        const fetchKegiatan = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (searchTerm) params.append('search', searchTerm)
                if (yearFilter) params.append('year', yearFilter)
                if (typeFilter) params.append('type', typeFilter)

                const res = await axios.get(`/api/kegiatan?${params.toString()}`)
                setKegiatans(res.data || [])
            } catch (error) {
                console.error('Error fetching kegiatans:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchKegiatan()
    }, [searchParams, searchTerm, yearFilter, typeFilter])

    const handleSearch = (e) => {
        e.preventDefault()
        const newParams = new URLSearchParams(searchParams)
        if (searchTerm) newParams.set('search', searchTerm)
        else newParams.delete('search')
        setSearchParams(newParams)
    }

    const handleYearChange = (e) => {
        const val = e.target.value
        setYearFilter(val)
        const newParams = new URLSearchParams(searchParams)
        if (val) newParams.set('tahun', val)
        else newParams.delete('tahun')
        setSearchParams(newParams)
    }

    const handleTypeChange = (e) => {
        const val = e.target.value
        setTypeFilter(val)
        const newParams = new URLSearchParams(searchParams)
        if (val) newParams.set('sifat', val)
        else newParams.delete('sifat')
        setSearchParams(newParams)
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => currentYear - i)

    return (
        <div className="page-activities overflow-hidden">
            <section className="page-hero" style={{ backgroundImage: "linear-gradient(rgba(7, 17, 12, 0.7), rgba(7, 17, 12, 0.7)), url('/image/fotobersejarah2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container">
                    <div className="page-hero__inner">
                        <span className="page-hero__eyebrow" data-aos="fade-up">
                            <i className="bi bi-calendar-event me-2"></i>
                            Rekam Jejak
                        </span>
                        <h1 className="page-hero__title" data-aos="fade-up" data-aos-delay="100">Galeri Aktivitas</h1>
                        <p className="page-hero__lead" data-aos="fade-up" data-aos-delay="200">
                            Dokumentasi kegiatan lapangan, latihan rutin, dan aksi keberlanjutan yang telah kami lalui.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section-shell" style={{ backgroundColor: 'var(--dark-color)', color: '#fff', minHeight: '80vh' }}>
                <div className="container">
                    {/* Search */}
                    <div className="row justify-content-center mb-5" data-aos="fade-up">
                        <div className="col-lg-7">
                            <form onSubmit={handleSearch}>
                                <div className="input-group input-group-lg" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                                    <span className="input-group-text bg-transparent border-0 ps-4">
                                        <i className="bi bi-search" style={{ color: 'var(--accent-color)' }}></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control bg-transparent border-0 text-white py-3 shadow-none"
                                        placeholder="Cari tempat atau nama kegiatan..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ fontSize: '1.1rem', letterSpacing: '0.02em' }}
                                    />
                                    <button className="btn px-4" type="submit" style={{ background: 'var(--accent-color)', color: 'var(--primary-color)', borderRadius: 0, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.1, fontSize: '0.85rem' }}>
                                        Cari
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="row justify-content-center mb-5" data-aos="fade-up" data-aos-delay="100">
                        <div className="col-lg-10">
                            <div className="row g-3">
                                <div className="col-md-5">
                                    <select className="form-select bg-transparent text-white border-0 py-3 rounded-0" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }} value={yearFilter} onChange={handleYearChange}>
                                        <option value="">Semua Tahun</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-5">
                                    <select className="form-select bg-transparent text-white border-0 py-3 rounded-0" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }} value={typeFilter} onChange={handleTypeChange}>
                                        <option value="">Semua Sifat</option>
                                        <option value="internal">Internal</option>
                                        <option value="eksternal">Eksternal</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <button onClick={() => { setSearchTerm(''); setYearFilter(''); setTypeFilter(''); setSearchParams({}) }} className="btn btn-outline-light w-100 py-3 rounded-0 border-0" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', fontWeight: 700 }}>RESET</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!loading && kegiatans.length > 0 ? (
                        <div className="row g-4">
                            {kegiatans.map((kegiatan, index) => (
                                <div className="col-12 col-md-6 col-lg-4" key={kegiatan.id} data-aos="fade-up" data-aos-delay={(index % 3) * 100}>
                                    <article className="doc-card" style={{ height: '440px' }}>
                                        <div className="doc-card__img-container">
                                            <img src={kegiatan.gambar_utama || '/image/fotobersejarah1.jpg'} alt={kegiatan.judul_kegiatan} className="doc-card__img" />
                                            <div className="doc-card__overlay"></div>
                                        </div>
                                        <div className="doc-card__content" style={{ padding: '2rem' }}>
                                            <span className="doc-card__tag" style={{ background: 'var(--accent-color)', color: 'var(--primary-color)', fontSize: '0.6rem' }}>{kegiatan.sifat}</span>
                                            <span className="doc-card__date" style={{ fontSize: '0.7rem' }}>
                                                {new Date(kegiatan.tanggal_pelaksanaan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <h3 className="doc-card__title" style={{ fontSize: '1.4rem' }}>{kegiatan.judul_kegiatan}</h3>
                                            <p className="x-small text-white-50 mb-0"><i className="bi bi-geo-alt-fill text-accent me-2"></i>{kegiatan.tempat}</p>
                                            <div className="doc-card__excerpt" style={{ fontSize: '0.85rem' }}>
                                                {kegiatan.materi && kegiatan.materi.substring(0, 100)}...
                                            </div>
                                            <span className="doc-card__link mt-3">Detail <i className="bi bi-arrow-right"></i></span>
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5" data-aos="fade-up">
                            <div style={{ background: 'rgba(255,255,255,0.05)', width: '120px', height: '120px', border_radius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <i className="bi bi-calendar-x display-3" style={{ color: 'rgba(255,255,255,0.15)' }}></i>
                            </div>
                            <h3 className="fw-bold" style={{ color: '#fff' }}>{loading ? 'Memuat...' : 'Kegiatan Tidak Ditemukan'}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)' }}>{loading ? 'Harap tunggu sebentar.' : 'Cari kegiatan lain atau reset filter untuk melihat semua arsip.'}</p>
                            {!loading && (
                                <button onClick={() => { setSearchTerm(''); setYearFilter(''); setTypeFilter(''); setSearchParams({}) }} className="btn-join-premium mt-4" style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem' }}>Tampilkan Semua</button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Activities
