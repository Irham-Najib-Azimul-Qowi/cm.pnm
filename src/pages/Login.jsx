import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await axios.post('/api/auth/login', { email, password })
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="admin-card" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="text-center mb-4">
                    <img src="/image/logo.png" alt="Logo" style={{ width: '80px', marginBottom: '1.5rem' }} />
                    <h2 className="fw-bold text-white">LOGIN ADMIN</h2>
                    <p className="text-white-50 small text-uppercase fw-bold letter-spacing-1">Cakra Manggala Control Panel</p>
                </div>

                {error && (
                    <div className="alert alert-danger border-0 rounded-0 small fw-bold mb-4">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="stat-label mb-2 d-block">Alamat Email</label>
                        <input
                            type="email"
                            className="form-control admin-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@cakramanggala.com"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="stat-label mb-2 d-block">Kata Sandi</label>
                        <input
                            type="password"
                            className="form-control admin-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-accent w-100 py-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span> MEMVERIFIKASI...</>
                        ) : (
                            'MASUK PANEL KONTROL'
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link to="/" className="text-white-50 small text-decoration-none">
                        <i className="bi bi-arrow-left me-2"></i> Kembali ke Situs
                    </Link>
                </div>
            </div>
        </div>
    )
}

// Add Link import if needed
import { Link } from 'react-router-dom'
export default Login
