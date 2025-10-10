import React, { useState, useEffect } from 'react';
import './ProjectList.css';
import DownloadButton from '../DownloadButton/DownloadButton';
import { api } from '../../services/api';

function getLoggedInUser() {
  if (typeof window === 'undefined') return null;
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

export default function ProjectList({ projects = [], onSearch = () => {}, onSort = () => {}, ownerName }) {
  const [expandedId, setExpandedId] = useState(null);
  const [analysisDetails, setAnalysisDetails] = useState({}); // Store details by projectId
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [showJustification, setShowJustification] = useState(false);
  const loggedInUser = getLoggedInUser();
  const displayName = ownerName || loggedInUser?.username || 'Você';

  const toggleExpand = (projectId) => {
    const newExpandedId = expandedId === projectId ? null : projectId;
    setExpandedId(newExpandedId);
    setShowJustification(false); // Reset justification view on toggle

    // Fetch analysis only if expanding and details are not already fetched
    if (newExpandedId && !analysisDetails[newExpandedId]) {
      fetchAnalysis(newExpandedId);
    }
  };

  const fetchAnalysis = async (projectId) => {
    setIsLoadingAnalysis(true);
    try {
      const result = await api.getProjectAnalysisDetails(projectId);
      setAnalysisDetails(prevDetails => ({
        ...prevDetails,
        [projectId]: result
      }));
    } catch (error) {
      console.error("Failed to fetch analysis details:", error);
      setAnalysisDetails(prevDetails => ({
        ...prevDetails,
        [projectId]: { error: "Falha ao carregar a análise." }
      }));
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const getScoresSummary = (details) => {
    const engScore = details?.pythonRatingDetails?.find(r => r.criterio.includes("Engenharia"))?.nota ?? 'N/A';
    const iaScore = details?.pythonRatingDetails?.find(r => r.criterio.includes("IA"))?.nota ?? 'N/A';
    return `Engenharia: ${engScore}, IA: ${iaScore}`;
  };

  return (
    <div className="project-list-card">
      <div className="project-list-header">
        <h3>{`Projetos de ${displayName}`}</h3>
        <div className="project-list-controls">
          <input className="project-search" placeholder="Buscar projetos..." onChange={e => onSearch(e.target.value)} />
          <select className="project-sort" onChange={e => onSort(e.target.value)}>
            <option value="recent">Mais recentes</option>
            <option value="old">Mais antigos</option>
            <option value="name">A-Z</option>
          </select>
        </div>
      </div>

      <div className="project-list-body">
        {projects.length === 0 ? (
          <div className="project-empty">Nenhum projeto encontrado</div>
        ) : (
          <ul className="project-items">
            {projects.map(p => (
              <React.Fragment key={p.id}>
                <li className="project-item" onClick={() => toggleExpand(p.id)}>
                  <div className="project-item-left">
                      <div className={`chev ${expandedId === p.id ? 'open' : ''}`} aria-hidden="true"></div>
                      <div className="project-item-title">{p.title}</div>
                      <div className="project-item-sub">{p.subtitle}</div>
                    </div>
                  <div className="project-item-right">{p.meta}</div>
                </li>

                {expandedId === p.id && (
                  <li className="project-item-expanded">
                    <div className="expanded-left"></div>
                    <div className="expanded-content">
                      {isLoadingAnalysis && analysisDetails[p.id] === undefined && <div className="analysis-loading">Carregando análise...</div>}
                      
                      {analysisDetails[p.id] && !analysisDetails[p.id].error && (
                        <>
                          <div className="analysis-summary">
                            {getScoresSummary(analysisDetails[p.id])}
                          </div>
                          <button className="details-btn" onClick={() => setShowJustification(!showJustification)}>
                            {showJustification ? 'Ocultar Detalhes' : 'Detalhes'}
                          </button>
                        </>
                      )}

                      {analysisDetails[p.id] && analysisDetails[p.id].error && <div className="analysis-error">{analysisDetails[p.id].error}</div>}

                      <DownloadButton analysisDetails={analysisDetails[p.id]} />
                    </div>
                    {showJustification && analysisDetails[p.id] && (
                      <div className="justification-details">
                        {analysisDetails[p.id].pythonRatingDetails.map((rating, index) => (
                          <div key={index} className="justification-item">
                            <h5>{rating.criterio} (Nota: {rating.nota})</h5>
                            <p>{rating.justificativa}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
