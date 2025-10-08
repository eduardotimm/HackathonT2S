import React from "react";
import profileIcon from "./profile-icon.png";
import "./Perfil.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="profile-section">
          <img src={profileIcon} alt="Perfil" className="sidebar-profile-icon" />
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-link">Conta</button>
          <button className="sidebar-link">Histórico</button>
        </nav>
      </aside>
      <main className="dashboard-main">
        <h1>Bem-vindo ao Dashboard</h1>
        <p>Selecione uma opção no menu à esquerda.</p>
      </main>
    </div>
  );
}
