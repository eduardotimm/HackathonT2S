import React from 'react';
import { useNavigate } from 'react-router-dom';
import useDropdown from '../../hooks/useDropdown';
import './HeaderDropdown.css';

export default function HeaderDropdown({ items }) {
  const navigate = useNavigate();
  const { open, setOpen, rootRef, caretRef, dropdownLeft } = useDropdown();

  const defaultItems = [
    { label: 'Home', to: '/' },
    { label: 'Projetos', disabled: true },
  ];
  const renderedItems = Array.isArray(items) && items.length ? items : defaultItems;

  function handleItemClick(item) {
    if (item.disabled) return;
    setOpen(false);
    if (typeof item.onClick === 'function') return item.onClick();
    if (item.to) return navigate(item.to);
  }

  return (
    <div className="header-dropdown-root" ref={rootRef}>
      <button ref={caretRef} className="logo-caret" aria-label="abrir menu" onClick={() => setOpen(o => !o)}>
        ▾
      </button>

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
