import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../logo.svg';
import profileIcon from '../../profile-icon.png';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const caretRef = useRef(null);
  const [dropdownLeft, setDropdownLeft] = useState(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    function computeLeft() {
      if (!ref.current || !caretRef.current) return;
      const headerRect = ref.current.getBoundingClientRect();
      const caretRect = caretRef.current.getBoundingClientRect();
      const arrowOffsetInside = 20;
      const extraShift = 8;
      const caretCenter = caretRect.left - headerRect.left + caretRect.width / 2;
      const dropdownLeftValue = Math.max(0, Math.round(caretCenter - arrowOffsetInside - extraShift));
      setDropdownLeft(dropdownLeftValue + 'px');
    }
    if (open) computeLeft();
    window.addEventListener('resize', computeLeft);
    return () => window.removeEventListener('resize', computeLeft);
  }, [open]);

  return (
    <header className="custom-header">
      <div className="header-left" ref={ref}>
        <img src={logo} className="custom-logo" alt="logo" onClick={() => navigate('/')} />
        <button ref={caretRef} className="logo-caret" aria-label="abrir menu" onClick={() => setOpen(o => !o)}>
          ▾
        </button>
        {open && (
          <div className="logo-dropdown" style={dropdownLeft ? { left: dropdownLeft } : undefined}>
            <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/'); }}>Home</button>
            <button className="dropdown-item disabled">Projetos</button>
          </div>
        )}
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
