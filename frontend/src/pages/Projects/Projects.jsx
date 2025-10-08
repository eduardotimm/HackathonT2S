import React, { useState } from 'react';
import ProjectList from '../../components/ProjectList/ProjectList';
import './Projects.css';

export default function Projects() {
  const [projects] = useState([]);
  const storedName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
  const ownerName = storedName || 'Você';

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Meus Projetos</h1>
        <p>Gerencie todos os seus projetos em um só lugar</p>
      </div>

      <div className="projects-container">
        <ProjectList projects={projects} ownerName={ownerName} />
      </div>
    </div>
  );
}
