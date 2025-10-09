import React from 'react';
import './App.css';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Projects from './pages/Projects/Projects';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
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
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/projects" element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
