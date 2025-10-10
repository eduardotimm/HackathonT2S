import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import './CentralForm.css';
import TextInput from '../../components/TextInput/TextInput';
import FileInput from '../../components/FileInput/FileInput';
import Button from '../../components/Button/Button';
import { api } from '../../services/api';

export default function CentralForm() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [supportsDirectory, setSupportsDirectory] = useState(true);

  // New states for analysis
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [createdProjectId, setCreatedProjectId] = useState(null);
  const pollingIntervalIdRef = useRef(null); // Usar useRef para o ID do intervalo

  const handleUrlChange = (value) => {
    setUrl(value);
    if (value) setFile(null);
  };

  const handleFileChange = (f) => {
    console.log('File input changed:', f);
    setFile(f || null);
    if (f) setUrl('');
  };

  useEffect(() => {
    try {
      const input = document.createElement('input');
      setSupportsDirectory('webkitdirectory' in input || 'mozdirectory' in input || 'directory' in input);
    } catch (e) {
      setSupportsDirectory(false);
    }
  }, []);

  // Helper to group ratings for display
  const groupRatings = (ratings) => {
    const engineeringCriteria = [
      "Adequação Funcional", "Manutenibilidade", "Confiabilidade",
      "Usabilidade (Clareza)", "Desempenho"
    ];
    const iaCriteria = [
      "Origem e Tratamento dos Dados", "Técnicas Aplicadas",
      "Estratégia de Validação e Escolha de Modelos",
      "Métricas de Avaliação, Custo e Desempenho",
      "Segurança e Governança",
      "Qualidade de Aplicação de IA" // Include the main criterion if AI returns it
    ];

    const grouped = {
      engineering: [],
      ia: [],
      other: [] // For any criteria not explicitly mapped
    };

    ratings.forEach(rating => {
      if (engineeringCriteria.includes(rating.criterio)) {
        grouped.engineering.push(rating);
      } else if (iaCriteria.includes(rating.criterio)) {
        grouped.ia.push(rating);
      } else {
        // If a criterion doesn't fit, put it in 'other'
        grouped.other.push(rating);
      }
    });
    return grouped;
  };

  // New function to fetch and check analysis status
  const fetchAnalysisStatus = useCallback(async (projectId) => {
    try {
      const result = await api.getProjectAnalysisDetails(projectId);
      if (result.status === "Analisado" && result.pythonRatingDetails && result.pythonRatingDetails.length > 0) {
        setAnalysisResult(result);
        setIsLoading(false);
        if (pollingIntervalIdRef.current) {
          clearInterval(pollingIntervalIdRef.current);
          pollingIntervalIdRef.current = null;
        }
        return true; // Analysis complete
      } else if (result.status === "Erro") {
        setAnalysisResult({ error: "Análise falhou no backend. Verifique os logs do servidor." });
        setIsLoading(false);
        if (pollingIntervalIdRef.current) {
          clearInterval(pollingIntervalIdRef.current);
          pollingIntervalIdRef.current = null;
        }
        return true; // Analysis failed
      }
      return false; // Analysis still pending
    } catch (err) {
      console.error("Erro ao buscar status da análise:", err);
      setAnalysisResult({ error: "Erro ao buscar status da análise. Verifique a conexão ou logs." });
      setIsLoading(false);
      if (pollingIntervalIdRef.current) {
        clearInterval(pollingIntervalIdRef.current);
        pollingIntervalIdRef.current = null;
      }
      return true; // Stop polling on error
    }
  }, []);


  useEffect(() => {
    if (createdProjectId && !analysisResult && isLoading) { // Only start polling if project created, no result yet, and loading is true
      const interval = setInterval(async () => {
        const finished = await fetchAnalysisStatus(createdProjectId);
        if (finished) {
          clearInterval(interval);
          pollingIntervalIdRef.current = null;
        }
      }, 5000); // Poll every 5 seconds
      pollingIntervalIdRef.current = interval;
    }

    // Cleanup on unmount or if createdProjectId changes
    return () => {
      if (pollingIntervalIdRef.current) {
        clearInterval(pollingIntervalIdRef.current);
        pollingIntervalIdRef.current = null;
      }
    };
  }, [createdProjectId, analysisResult, isLoading, fetchAnalysisStatus]); // Adiciona fetchAnalysisStatus como dependência

  const handleOk = async () => {
    console.log({ projectName, description, url, file });

    // Pega os dados do usuário do localStorage
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert("Você precisa estar logado para criar um projeto.");
      navigate('/login'); // Redireciona para o login
      return;
    }

    const user = JSON.parse(userString);
    const userId = user.userID; // Usa o ID do usuário logado

    setIsLoading(true); // Start loading indicator
    setAnalysisResult(null); // Clear previous results
    setCreatedProjectId(null); // Clear previous project ID

    // Só aceita URL preenchida e não arquivo
    if (url && !file) {
      const payload = {
        name: projectName,
        repoURL: url,
        description: description
      };

      try {
        const response = await api.createProject(userId, payload);
        console.log('Projeto criado:', response);
        setCreatedProjectId(response.projectID); // Store the created project ID to trigger polling
      } catch (err) {
        setIsLoading(false); // Stop loading on error
        console.error('Erro ao criar projeto:', err);
        alert('Erro ao criar projeto: ' + err.message);
      }

    } else {
      // Se temos arquivos (pasta) selecionados, envie como multipart/form-data
      if (file && Array.isArray(file) && file.length > 0) {
        const formData = new FormData();
        formData.append('name', projectName || '(Upload de pasta)');
        formData.append('description', description || '');
        // Adiciona cada arquivo mantendo o path fornecido pelo browser quando disponível
        file.forEach((f) => {
          // Muitos browsers suportam `webkitRelativePath` no File object
          if (f.webkitRelativePath) {
            // inclui o caminho relativo como parte do nome do campo para tentar preservar estrutura
            formData.append('files', f, f.webkitRelativePath);
          } else {
            formData.append('files', f, f.name);
          }
        });

        try {
          const userString = localStorage.getItem('user');
          const user = JSON.parse(userString);
          const userId = user.userID;
          const uploadResponse = await api.uploadProjectFolder(userId, formData);
          console.log('Upload criado:', uploadResponse);
          setCreatedProjectId(uploadResponse.projectID); // Store the created project ID to trigger polling
        } catch (err) {
          setIsLoading(false); // Stop loading on error
          console.error('Erro ao enviar pasta:', err);
          alert('Erro ao enviar pasta: ' + err.message);
        }
        // The polling useEffect will handle setting analysisResult and isLoading(false)
      }

      // Não navega mais imediatamente, espera a análise.
      // O comportamento de navegação foi removido para permitir que o polling funcione.
    }
  };

  return (
    <div className="central-container">
      <header className="home-hero">
        <h1 className="hero-title">Avalie seu código em segundos</h1>
        <p className="hero-sub">Cole a URL do seu repositório ou envie um arquivo. Receba uma nota automática com insights de qualidade.</p>
      </header>
      <TextInput
        value={projectName}
        onChange={setProjectName}
        placeholder="Digite o nome do projeto"
        maxLength={200}
      />

      <TextInput
        value={description}
        onChange={setDescription}
        placeholder="Descrição do projeto"
        maxLength={1000}
      />

      <TextInput
        value={url}
        onChange={handleUrlChange}
        placeholder="Digite sua Url"
        maxLength={200}
        disabled={!!file}
        className={file ? 'input-disabled' : ''}
      />

      <div className="cf-row">
        <FileInput onChange={handleFileChange} disabled={!!url} multiple={true} directory={true} label={file ? `${file.length} arquivos selecionados` : 'Anexar pasta'} />
        {!supportsDirectory && (
          <div style={{ color: '#f2b233', marginLeft: '12px' }}>
            Seu navegador pode não suportar seleção de pastas. Use Chrome/Edge para anexar pastas.
          </div>
        )}
        <Button label="OK" onClick={handleOk} />
      </div>

      {/* Loading indicator */}
      {isLoading && (
          <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Analisando projeto com IA... Isso pode levar alguns segundos.</p>
          </div>
      )}

      {/* Analysis Results */}
      {analysisResult && !analysisResult.error && (
          <div className="analysis-results">
              <h3>Resultados da Análise de IA</h3>
              <p><strong>Pontuação Média Final: {analysisResult.averageScore?.toFixed(1)}/100</strong></p>

              {analysisResult.pythonRatingDetails && analysisResult.pythonRatingDetails.length > 0 && (
                  <>
                      <h4>Qualidade de Engenharia de Software</h4>
                      {groupRatings(analysisResult.pythonRatingDetails).engineering.map((rating, index) => (
                          <div key={index} className="rating-item">
                              <h5>{rating.criterio} - Nota: {rating.nota}/100</h5>
                              <p>{rating.justificativa}</p>
                          </div>
                      ))}

                      <h4>Qualidade de Aplicação de IA</h4>
                      {groupRatings(analysisResult.pythonRatingDetails).ia.map((rating, index) => (
                          <div key={index} className="rating-item">
                              <h5>{rating.criterio} - Nota: {rating.nota}/100</h5>
                              <p>{rating.justificativa}</p>
                          </div>
                      ))}
                      {groupRatings(analysisResult.pythonRatingDetails).other.length > 0 && (
                          <>
                              <h4>Outros Critérios</h4>
                              {groupRatings(analysisResult.pythonRatingDetails).other.map((rating, index) => (
                                  <div key={index} className="rating-item">
                                      <h5>{rating.criterio} - Nota: {rating.nota}/100</h5>
                                      <p>{rating.justificativa}</p>
                                  </div>
                              ))}
                          </>
                      )}
                  </>
              )}
          </div>
      )}

      {/* Error Message for Analysis */}
      {analysisResult && analysisResult.error && (
          <div className="error-message">
              <p>Erro na análise: {analysisResult.error}</p>
          </div>
      )}
    </div>
  );
}
