import React from 'react';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import logo from '../../Logo.png';
import HeaderDropdown from '../HeaderDropdown/HeaderDropdown';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="custom-header">
      <div className="header-left">
        <img src={logo} className="custom-logo" alt="logo" onClick={() => navigate('/')} />
        <HeaderDropdown />
      </div>
      {/* ...botão antigo removido, apenas Button do projeto permanece... */}
        <div className="header-right">
        {!(location.pathname === '/login' || location.pathname === '/register') && (
          <Button
            label="Entrar"
            onClick={() => navigate('/login')}
            variant="primary"
            size="md"
          />
        )}
        </div>
    </header>
  );
}
