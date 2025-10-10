import React from 'react';
import { useNavigate } from 'react-router-dom';
import useDropdown from '../../hooks/useDropdown';
import './HeaderDropdown.css';

export default function HeaderDropdown({ items, trigger, offset }) {
  const navigate = useNavigate();
  const { open, setOpen, rootRef, caretRef, dropdownLeft } = useDropdown({ offset });

  const defaultItems = [
    { label: 'Home', to: '/' },
    { label: 'Projetos', to: '/projects' },
    { label: 'Dashboard', to: '/dashboard' },
  ];
  const renderedItems = Array.isArray(items) && items.length ? items : defaultItems;

  function handleItemClick(item) {
    if (item.disabled) return;
    setOpen(false);
    
    // Verificar se o usuário está logado antes de navegar para Dashboard
    if (item.to === '/dashboard') {
      const user = localStorage.getItem('user');
      if (!user) {
        return navigate('/login');
      }
    }
    
    if (typeof item.onClick === 'function') return item.onClick();
    if (item.to) return navigate(item.to);
  }

  return (
    <div className="header-dropdown-root" ref={rootRef}>
      {trigger ? (
        // attach ref and click handler to the provided trigger element
        React.cloneElement(trigger, {
          ref: caretRef,
          onClick: (e) => {
            try { if (typeof trigger.props.onClick === 'function') trigger.props.onClick(e); } catch (_) {}
            setOpen(o => !o);
          },
          'aria-label': trigger.props && trigger.props['aria-label'] ? trigger.props['aria-label'] : 'abrir menu'
        })
      ) : (
        <button ref={caretRef} className="logo-caret" aria-label="abrir menu" onClick={() => setOpen(o => !o)}>
          ▾
        </button>
      )}

      {open && (
        <div className="logo-dropdown" style={dropdownLeft ? { left: dropdownLeft } : undefined}>
          {renderedItems.map((it, idx) => (
            <button key={idx} className={`dropdown-item ${it.disabled ? 'disabled' : ''}`} onClick={() => handleItemClick(it)} disabled={it.disabled}>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
