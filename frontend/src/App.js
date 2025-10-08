import React from 'react';
import logo from './logo.svg';
import './App.css';
import profileIcon from './profile-icon.png';
import Login from './Login';
import Register from './Register';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import CentralForm from './CentralForm';
import Dashboard from './Perfil';

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
        <CentralForm />
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
          <Route path="/perfil" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
