import React from "react";
import { useNavigate } from 'react-router-dom';
import "./CentralForm.css";

export default function CentralForm() {
  const navigate = useNavigate();
  return (
    <div className="central-container">
      <input
        type="text"
        className="url-input"
        placeholder="Digite sua Url"
        maxLength={200}
      />
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', marginTop: '24px' }}>
        <label className="file-label">
          <input type="file" className="file-input" />
          <img
            src="https://cdn-icons-png.flaticon.com/512/60/60740.png"
            alt="Anexar arquivo"
            className="file-icon"
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
          onClick={() => navigate('/nova-pagina')}
        >
          OK
        </button>
      </div>
    </div>
  );
}
