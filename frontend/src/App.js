import React from 'react';
import logo from './logo.svg';
import './App.css';
import profileIcon from './profile-icon.png';
import Login from './Login';
import Register from './Register';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="custom-app">
      <header className="custom-header">
        <div className="header-left">
          <img src={logo} className="custom-logo" alt="logo" />
        </div>
        <div className="header-right">
          <img
            src={profileIcon}
            alt="Perfil/Login"
            className="profile-icon"
            style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          />
        </div>
      </header>
      <main className="custom-main">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px', width: '100%' }}>
          <input
            type="text"
            className="url-input"
            placeholder="Cole ou digite uma URL aqui"
            maxLength={200}
            style={{ width: '400px', maxWidth: '90vw', height: '40px', fontSize: '1.1rem', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
            <label className="file-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#f5f5f5', padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <input type="file" className="file-input" style={{ display: 'none' }} />
              <img
                src="https://cdn-icons-png.flaticon.com/512/60/60740.png"
                alt="Anexar arquivo"
                className="file-icon"
                style={{ width: '24px', height: '24px' }}
              />
              <span>Anexar arquivo</span>
            </label>
            <button
              className="ok-btn"
              style={{
                padding: '12px 32px',
                fontSize: '1.1rem',
                borderRadius: '8px',
                background: '#646cff',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onClick={() => navigate('/dashboard')}
            >
              OK
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
