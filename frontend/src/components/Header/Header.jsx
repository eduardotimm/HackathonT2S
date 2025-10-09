import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import logo from '../../Logo.png';
import HeaderDropdown from '../HeaderDropdown/HeaderDropdown';
import profileIcon from '../../profile-icon.png';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [storedName, setStoredName] = useState(typeof window !== 'undefined' ? localStorage.getItem('userName') : null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    function onAuthChange() {
      setStoredName(typeof window !== 'undefined' ? localStorage.getItem('userName') : null);
      const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      setUser(userString ? JSON.parse(userString) : null);
    }

    // Executa na primeira vez que o componente carrega
    onAuthChange();

    // Ouve por mudanças na autenticação
    window.addEventListener('authChanged', onAuthChange);
    return () => window.removeEventListener('authChanged', onAuthChange);
  }, []);

  return (
    <header className="custom-header">
      <div className="header-left">
        <img src={logo} className="custom-logo" alt="logo" onClick={() => navigate('/')} />
        <span className="header-label" onClick={() => navigate('/')} aria-label="HaTi">Hati</span>
        <HeaderDropdown />
      </div>
      
      
      {/* ...botão antigo removido, apenas Button do projeto permanece... */}
        <div className="header-right">
          {/* if user is logged (we keep userName in localStorage) show profile icon */}
          {user ? (
            <HeaderDropdown
              trigger={(
                <img
                  src={profileIcon}
                  alt="perfil"
                  className="profile-icon"
                  title={user.username}
                />
              )}
              items={[
                { label: 'Conta', to: '/projects' },
                { label: 'Sair', onClick: () => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  window.dispatchEvent(new Event('authChanged'));
                  navigate('/');
                } },
              ]}
              offset={260}
            />
          ) : (
            !(location.pathname === '/login' || location.pathname === '/register') && (
              <Button
                label="Entrar"
                onClick={() => navigate('/login')}
                variant="primary"
                size="md"
              />
            )
          )}
        </div>
    </header>
  );
}

.notification-popup {
  position: fixed;
  top: 80px; /* Abaixo do header */
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: fadeInDown 0.5s ease-out;
}

.notification-popup.success {
  background-color: #28a745; /* Verde para sucesso */
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
