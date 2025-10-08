import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../logo.svg';
import profileIcon from '../../profile-icon.png';
import HeaderDropdown from '../Dropdown/HeaderDropdown';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="custom-header">
      <div className="header-left">
        <img src={logo} className="custom-logo" alt="logo" onClick={() => navigate('/')} />
        <HeaderDropdown />
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
  );
}
