import React, { useState, useEffect } from 'react'
import axios from 'axios'

const MessagesManagement = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get('/api/admin/pesan', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessages(res.data || [])
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleMarkRead = async (id, isRead) => {
        try {
            const token = localStorage.getItem('token')
            await axios.put(`/api/admin/pesan?id=${id}`, { is_read: isRead }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchData()
        } catch (error) {
            alert('Gagal update status')
        }
    }

    return (
        <div className="p-4 p-md-5">
            <div className="mb-5">
                <h1 className="h2 fw-bold text-white mb-1">Pesan Masuk</h1>
                <p className="text-white-50 small">Kelola komunikasi dari pengunjung website.</p>
            </div>

            <div className="row g-4">
                {loading ? (
                    <div className="col-12 text-center py-5"><div className="spinner-border text-accent"></div></div>
                ) : messages.length > 0 ? messages.map(m => (
                    <div className="col-12" key={m.id}>
                        <div className={`p-4 ${m.is_read ? 'opacity-50' : 'border-start border-accent border-4'}`} style={{ background: 'var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h4 className="h6 fw-bold text-white mb-1">{m.subjek}</h4>
                                    <p className="small text-accent mb-0">{m.nama} &lt;{m.email}&gt;</p>
                                </div>
                                <span className="small text-white-50">{new Date(m.created_at).toLocaleDateString('id-ID')}</span>
                            </div>
                            <p className="text-white-50 small mb-4" style={{ whiteSpace: 'pre-wrap' }}>{m.pesan}</p>
                            <div className="d-flex gap-2">
                                {!m.is_read ? (
                                    <button onClick={() => handleMarkRead(m.id, true)} className="btn btn-sm btn-accent rounded-0 text-primary fw-bold" style={{ fontSize: '0.7rem' }}>TANDAI SUDAH BACA</button>
                                ) : (
                                    <button onClick={() => handleMarkRead(m.id, false)} className="btn btn-sm btn-outline-light rounded-0 opacity-50" style={{ fontSize: '0.7rem' }}>TANDAI BELUM BACA</button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 text-center py-5 text-white-50">Kotak masuk kosong.</div>
                )}
            </div>
        </div>
    )
}

export default MessagesManagement
