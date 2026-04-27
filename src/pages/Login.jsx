import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

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
        <div className="login-wrapper">
            <style>
                {`
                :root {
                    --primary: #1a4331;
                    --secondary: #255b44;
                    --accent: #f2b661;
                    --dark: #07110c;
                }
                .login-wrapper { display: flex; height: 100vh; background: var(--dark); }
                .login-visual { flex: 1.2; position: relative; overflow: hidden; }
                .login-visual img.bg-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
                .visual-overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--dark) 0%, rgba(7, 17, 12, 0.4) 50%, rgba(7, 17, 12, 0.3) 100%); padding: 4rem; display: flex; flex-direction: column; justify-content: flex-end; color: white; }
                .visual-logo { position: absolute; top: 3rem; left: 3.5rem; display: flex; align-items: center; gap: 14px; text-decoration: none; color: white; z-index: 10; }
                .visual-logo img { width: 48px; opacity: 1 !important; }
                .visual-logo span { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; }
                .login-form-container { flex: 1; background: var(--primary); display: flex; align-items: center; justify-content: center; padding: 4rem; z-index: 5; }
                .login-form-box { width: 100%; max-width: 380px; color: #fff; }
                .login-form-box h2 { font-weight: 800; font-size: 2rem; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.03em; font-family: 'Montserrat', sans-serif; }
                .login-form-box > p { color: rgba(255, 255, 255, 0.5); margin-bottom: 2.5rem; font-size: 0.95rem; }
                .form-label { font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.6rem; }
                .form-control.login-input { border-radius: 0; padding: 0.9rem 1rem; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.05); color: #fff; transition: 0.3s; }
                .form-control.login-input::placeholder { color: rgba(255, 255, 255, 0.25); }
                .form-control.login-input:focus { border-color: var(--accent); box-shadow: none; background: rgba(255, 255, 255, 0.08); color: #fff; }
                .btn-login { background: var(--accent); color: var(--primary); border: none; padding: 1rem; border-radius: 0; font-weight: 800; width: 100%; margin-top: 1.5rem; transition: 0.3s; text-transform: uppercase; letter-spacing: 0.15em; font-family: 'Montserrat', sans-serif; font-size: 0.85rem; }
                .btn-login:hover { background: #fff; color: var(--primary); }
                .form-check-input { border-radius: 0; }
                .form-check-input:checked { background-color: var(--accent); border-color: var(--accent); }
                .form-check-label { color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; }
                @media (max-width: 991px) { .login-visual { display: none; } .login-form-container { padding: 2.5rem; } body { overflow: auto; } }
                `}
            </style>
            <div className="login-visual">
                <Link to="/" className="visual-logo">
                    <img src="/image/logo.png" alt="Logo" />
                    <span>Cakra Manggala</span>
                </Link>
                <img src="/image/fotobersejarah2.jpg" alt="Background" className="bg-img" />
                <div className="visual-overlay">
                    <h1 className="display-4 fw-bold" style={{ letterSpacing: '-0.03em', fontFamily: "'Montserrat', sans-serif" }}>
                        Mendaki Tinggi,<br /><span style={{ color: 'var(--accent)' }}>Menjaga Bumi</span>
                    </h1>
                    <p className="fs-6 mt-3" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px' }}>
                        Panel administrasi khusus pengelola UKM Pecinta Alam Cakra Manggala.
                    </p>
                </div>
            </div>

            <div className="login-form-container">
                <div className="login-form-box">
                    <h2>Masuk Admin</h2>
                    <p>Kelola portal organisasi dari sini.</p>

                    {error && (
                        <div className="alert border-0 p-3 small mb-4" style={{ background: 'rgba(220,53,69,0.1)', color: '#ff6b6b', borderLeft: '3px solid #ff6b6b' }}>
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control login-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@cakramanggala.id"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control login-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="extra-links d-flex justify-content-between align-items-center mb-4">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="remember" />
                                <label className="form-check-label" htmlFor="remember">Ingat Saya</label>
                            </div>
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'MEMVERIFIKASI...' : 'Masuk Sekarang'}
                        </button>
                    </form>

                    <div className="text-center mt-5">
                        <Link to="/" className="text-white-50 text-decoration-none small">
                            <i className="bi bi-arrow-left me-1"></i> Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
