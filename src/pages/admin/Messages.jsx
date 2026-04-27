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

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus pesan?')) return
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`/api/admin/pesan?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchData()
        } catch (error) {
            alert('Gagal menghapus pesan')
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="h3 fw-black mb-1" style={{ letterSpacing: '-0.02em' }}>KOTAK MASUK</h1>
                    <p className="text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '0.1em' }}>Komunikasi Publik Cakra Manggala</p>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}></th>
                            <th>Pengirim</th>
                            <th>Subjek & Pesan</th>
                            <th className="d-none d-md-table-cell">Waktu</th>
                            <th className="text-end">Manajemen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    <div className="spinner-border text-accent" role="status"></div>
                                </td>
                            </tr>
                        ) : messages.length > 0 ? messages.map(pesan => (
                            <tr key={pesan.id} style={!pesan.is_read ? { background: 'rgba(242,182,97,0.03)' } : {}}>
                                <td className="text-center">
                                    {!pesan.is_read && (
                                        <div className="bg-accent" style={{ width: '8px', height: '8px', margin: '0 auto' }}></div>
                                    )}
                                </td>
                                <td>
                                    <div className="fw-black text-white mb-1" style={{ fontSize: '0.95rem' }}>{pesan.nama.toUpperCase()}</div>
                                    <div className="x-small text-white-50 fw-bold" style={{ fontSize: '0.7rem' }}>{pesan.email}</div>
                                </td>
                                <td>
                                    <div className="fw-bold text-accent mb-1" style={{ fontSize: '0.85rem' }}>{pesan.subjek}</div>
                                    <div className="text-white-50 text-truncate small" style={{ maxWidth: '350px' }}>
                                        {pesan.pesan}
                                    </div>
                                </td>
                                <td className="small text-white-50 d-none d-md-table-cell">
                                    <div className="fw-bold text-white">{new Date(pesan.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                    <div className="x-small fw-bold text-uppercase" style={{ fontSize: '0.6rem' }}>
                                        {new Date(pesan.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                        {!pesan.is_read ? (
                                            <button onClick={() => handleMarkRead(pesan.id, true)} className="btn btn-sm btn-outline-light border-0 rounded-0 fw-black px-3" style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', letterSpacing: '0.1em' }}>TANDAI DIBACA</button>
                                        ) : (
                                            <button onClick={() => handleMarkRead(pesan.id, false)} className="btn btn-sm btn-outline-light border-0 rounded-0 fw-black px-3" style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', letterSpacing: '0.1em' }}>TANDAI BELUM BACA</button>
                                        )}
                                        <button onClick={() => handleDelete(pesan.id)} type="button" className="btn btn-sm border-0 rounded-0 fw-black px-3" style={{ fontSize: '0.7rem', background: 'rgba(255,99,102,0.1)', color: '#ff6366' }}>
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-white-50 fst-italic">Kotak masuk kosong.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default MessagesManagement
