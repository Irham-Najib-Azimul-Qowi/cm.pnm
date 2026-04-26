import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const Dashboard = () => {
    const [stats, setStats] = useState({
        articles: 0,
        activities: 0,
        members: 0,
        messages: 0,
        views: 0
    })
    const [recentSubmissions, setRecentSubmissions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await axios.get('/api/articles?per_page=1') // Get stats from articles endpoint
                const artStats = res.data.stats || {}

                // Fetch other counts
                const [regRes, msgRes, kegRes] = await Promise.all([
                    axios.get('/api/admin/pendaftaran', { headers: { Authorization: `Bearer \${token}` } }),
                    axios.get('/api/admin/pesan', { headers: { Authorization: `Bearer \${token}` } }),
                    axios.get('/api/kegiatan')
                ])

                setStats({
                    articles: artStats.total || 0,
                    activities: kegRes.data?.length || 0,
                    members: regRes.data?.filter(r => r.status === 'approved').length || 0,
                    messages: msgRes.data?.filter(m => !m.is_read).length || 0,
                    views: artStats.total_views || 0
                })

                // Combined recent list
                const combined = [
                    ...(regRes.data?.slice(0, 5).map(r => ({ ...r, type: 'PENDAFTRAN', date: r.created_at, label: r.nama_lengkap })) || []),
                    ...(msgRes.data?.slice(0, 5).map(m => ({ ...m, type: 'PESAN', date: m.created_at, label: m.subjek })) || [])
                ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)

                setRecentSubmissions(combined)
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const chartData = [
        { name: 'Artikel', count: stats.articles },
        { name: 'Kegiatan', count: stats.activities },
        { name: 'Pendaftar', count: stats.members },
        { name: 'Pesan', count: stats.messages },
    ]

    const COLORS = ['#F2B661', '#4CAF50', '#2196F3', '#FF5252']

    return (
        <div className="p-4 p-md-5">
            <div className="mb-5 d-flex justify-content-between align-items-end">
                <div>
                    <h1 className="h2 fw-bold text-white mb-1">Command Center</h1>
                    <p className="text-white-50 small mb-0">Pemantauan real-time operasional Cakra Manggala.</p>
                </div>
                <div className="text-end d-none d-md-block">
                    <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 border border-success border-opacity-25 rounded-0 fw-bold" style={{ fontSize: '0.65rem' }}>
                        <i className="bi bi-circle-fill me-2 small"></i> SYSTEM ONLINE
                    </div>
                </div>
            </div>

            {/* Top Cards */}
            <div className="row g-4 mb-5">
                {[
                    { label: 'Artikel Aktif', value: stats.articles, icon: 'bi-journal-richtext', color: '#F2B661' },
                    { label: 'Total Kegiatan', value: stats.activities, icon: 'bi-calendar-event', color: '#4CAF50' },
                    { label: 'Warna Baru (Approved)', value: stats.members, icon: 'bi-people', color: '#2196F3' },
                    { label: 'Unread Messages', value: stats.messages, icon: 'bi-chat-dots', color: '#FF5252' },
                ].map((c, i) => (
                    <div className="col-12 col-md-6 col-xl-3" key={i}>
                        <div className="p-4 h-100" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, fontSize: '5rem' }}><i className={`bi \${c.icon}`}></i></div>
                            <span className="small text-uppercase fw-bold text-white-50 d-block mb-3" style={{ letterSpacing: '0.1em' }}>{c.label}</span>
                            <div className="d-flex align-items-baseline gap-3">
                                <h3 className="h1 fw-bold text-white mb-0">{c.value}</h3>
                                <span className={i === 3 && c.value > 0 ? "text-danger animate-pulse" : "text-white-50"}>
                                    <i className={`bi \${c.icon}`}></i>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-5">
                {/* Chart Section */}
                <div className="col-xl-7">
                    <div className="h-100 p-4 p-md-5" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h4 className="small fw-bold text-white text-uppercase" style={{ letterSpacing: '0.15em' }}>Distribusi Data</h4>
                            <select className="bg-transparent border-0 text-white-50 small outline-none">
                                <option className="bg-dark">Semua Waktu</option>
                            </select>
                        </div>
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }} dy={10} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ background: '#0a160f', border: '1px solid var(--accent-color)', borderRadius: 0, padding: '10px' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    />
                                    <Bar dataKey="count" radius={[2, 2, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="col-xl-5">
                    <div className="h-100 p-4 p-md-5" style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 className="small fw-bold text-white text-uppercase mb-5" style={{ letterSpacing: '0.15em' }}>Paling Gress</h4>
                        <div className="d-flex flex-column gap-4">
                            {recentSubmissions.length > 0 ? recentSubmissions.map((sub, i) => (
                                <div key={i} className="d-flex align-items-center gap-4">
                                    <div className="flex-shrink-0" style={{ width: '40px', height: '40px', background: sub.type === 'PENDAFTRAN' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(255, 82, 82, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sub.type === 'PENDAFTRAN' ? '#2196F3' : '#FF5252' }}>
                                        <i className={`bi \${sub.type === 'PENDAFTRAN' ? 'bi-person-plus' : 'bi-chat-dots'}`}></i>
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="d-flex justify-content-between">
                                            <span className="small fw-bold text-uppercase" style={{ fontSize: '0.6rem', color: sub.type === 'PENDAFTRAN' ? '#2196F3' : '#FF5252', letterSpacing: '0.1em' }}>{sub.type}</span>
                                            <span className="small text-white-50" style={{ fontSize: '0.6rem' }}>{new Date(sub.date).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        <h5 className="h6 text-white text-truncate mb-0 fw-bold">{sub.label}</h5>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-5 text-center text-white-50 small italic">Belum ada aktivitas baru.</div>
                            )}
                        </div>
                        <div className="mt-5 pt-4 border-top border-secondary border-opacity-25">
                            <Link to="/dashboard/registrations" className="text-accent text-decoration-none small fw-bold text-uppercase d-flex align-items-center gap-2">
                                Semua Aktivitas <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
