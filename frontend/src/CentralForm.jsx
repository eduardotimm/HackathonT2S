import React from "react";
import { useNavigate } from 'react-router-dom';
import "./CentralForm.css";

export default function CentralForm() {
  const navigate = useNavigate();
  const [url, setUrl] = React.useState("");
  const [file, setFile] = React.useState(null);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="central-container">
      <input
        type="text"
        className="input"
        placeholder="Digite o nome do projeto"
        maxLength={200}
      />
      <input
        type="text"
        className={`input${file ? ' input-disabled' : ''}`}
        placeholder="Digite sua Url"
        maxLength={200}
        value={url}
        onChange={handleUrlChange}
        disabled={!!file}
      />
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', marginTop: '24px' }}>
  <label className={`file-label${url ? ' file-label-disabled' : ''}`}> 
          <input
            type="file"
            className="file-input"
            onChange={handleFileChange}
            disabled={!!url}
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/60/60740.png"
            alt="Anexar arquivo"
            className="file-icon"
          />
          <span className="file-label-text">Anexar arquivo</span>
        </label>
        <button
          className="ok-btn"
        >
          OK
        </button>
      </div>
    </div>
  );
}
