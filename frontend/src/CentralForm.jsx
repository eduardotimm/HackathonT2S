import React from "react";
import "./CentralForm.css";

export default function CentralForm() {
  return (
    <div className="central-container">
      <input
        type="text"
        className="url-input"
        placeholder="Cole ou digite uma URL aqui"
        maxLength={200}
      />
      <label className="file-label">
        <input type="file" className="file-input" />
        <img
          src="https://cdn-icons-png.flaticon.com/512/60/60740.png"
          alt="Anexar arquivo"
          className="file-icon"
        />
        <span>Anexar arquivo</span>
      </label>
    </div>
  );
}
