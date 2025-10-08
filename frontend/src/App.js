import React from 'react';
import './App.css';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CentralForm from './pages/CentralForm/CentralForm';
import Header from './components/Header/Header';

function Home() {
  return (
    <main className="custom-main">
      <CentralForm />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="custom-app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
