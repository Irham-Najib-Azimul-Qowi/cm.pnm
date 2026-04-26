import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        draft: 0,
        total_views: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('/api/articles', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (response.data.stats) {
                    setStats(response.data.stats)
                }
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const statCards = [
        { label: 'Total Artikel', value: stats.total, icon: 'bi-file-earmark-text', color: 'var(--accent)' },
        { label: 'Published', value: stats.published, icon: 'bi-check-circle', color: '#2ecc71' },
        { label: 'Draft', value: stats.draft, icon: 'bi-pencil-square', color: '#f1c40f' },
        { label: 'Total Views', value: stats.total_views, icon: 'bi-eye', color: '#3498db' },
    ]

    return (
        <AdminLayout>
            <div className="row g-4 mb-5">
                {statCards.map((stat, index) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={index}>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ color: stat.color }}>
                                <i className={`bi ${stat.icon}`}></i>
                            </div>
                            <div>
                                <div className="stat-label">{stat.label}</div>
                                <div className="stat-value">{loading ? '...' : stat.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="admin-card">
                        <h3 className="h5 fw-bold mb-4 text-white">AKSES CEPAT</h3>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <Link to="/dashboard/artikel/create" className="quick-link">
                                    <div className="quick-link__icon"><i className="bi bi-plus-lg"></i></div>
                                    <div>
                                        <div className="fw-bold">Buat Artikel</div>
                                        <div className="small text-white-50">Tulis catatan atau berita baru</div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-6">
                                <Link to="/dashboard/kegiatan/create" className="quick-link">
                                    <div className="quick-link__icon"><i className="bi bi-calendar-plus"></i></div>
                                    <div>
                                        <div className="fw-bold">Tambah Kegiatan</div>
                                        <div className="small text-white-50">Jadwalkan agenda UKM terbaru</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="admin-card h-100">
                        <h3 className="h5 fw-bold mb-4 text-white">INFO SISTEM</h3>
                        <div className="d-flex flex-column gap-3">
                            <div className="p-3 border border-secondary bg-dark">
                                <div className="small text-white-50 text-uppercase fw-bold mb-1">Status Server</div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="p-1 rounded-circle bg-success"></span>
                                    <span className="fw-bold">OPERASIONAL</span>
                                </div>
                            </div>
                            <div className="p-3 border border-secondary bg-dark">
                                <div className="small text-white-50 text-uppercase fw-bold mb-1">Versi Arsitektur</div>
                                <div className="fw-bold">Serverless Go v1.21</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

import { Link } from 'react-router-dom'
export default Dashboard
