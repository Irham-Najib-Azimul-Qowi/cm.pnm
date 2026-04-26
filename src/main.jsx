import React from 'react'
import ReactDom from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'aos/dist/aos.css'
import AOS from 'aos'

AOS.init({
    duration: 800,
    once: true,
})

ReactDom.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
