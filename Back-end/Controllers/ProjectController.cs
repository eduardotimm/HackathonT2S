﻿﻿﻿﻿﻿using Microsoft.AspNetCore.Mvc;
using HackathonT2S.Data;
using HackathonT2S.Dtos;
using HackathonT2S.Dtos;
using System.Threading.Tasks;
using HackathonT2S.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using System.Net.Http;
using System.Text;
using Microsoft.Extensions.DependencyInjection;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Authorize] // << Adicionado: Agora todas as ações de projeto exigem login.
    [Route("ada/users/{userId}/projects")] // Rota base para projetos de um usuário
    public class ProjectController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IServiceScopeFactory _scopeFactory;

        public ProjectController(AppDbContext context, IConfiguration configuration, IHttpClientFactory httpClientFactory, IServiceScopeFactory scopeFactory)
        {
            _context = context;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _scopeFactory = scopeFactory;
        }

        // Endpoint para upload de pasta (aceita arquivos múltiplos de um input com webkitdirectory)
        // Salvamos os arquivos em uma pasta no servidor e criamos o projeto com LocalPath apontando para a pasta salva.
    [HttpPost("upload")]
    [RequestSizeLimit(1073741824)] // limite 1GB por requisição
        public async Task<ActionResult<ProjectResponseDto>> UploadProjectFolder(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound($"Usuário com ID {userId} não encontrado.");
            }

            if (!Request.HasFormContentType)
            {
                return BadRequest("Requisição deve ser multipart/form-data com os arquivos da pasta.");
            }

            var form = await Request.ReadFormAsync();
            var files = form.Files;
            if (files == null || files.Count == 0)
            {
                return BadRequest("Nenhum arquivo enviado.");
            }

            // Cria diretório único para este upload
            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "UploadedProjects");
            Directory.CreateDirectory(uploadsRoot);
            var projectGuid = Guid.NewGuid().ToString();
            var targetDir = Path.Combine(uploadsRoot, userId.ToString(), projectGuid);
            Directory.CreateDirectory(targetDir);

            // Salva cada arquivo mantendo a subpasta relativo (se enviado com webkitdirectory, o browser inclui path no File.name ou em uma propriedade webkitRelativePath)
            foreach (var file in files)
            {
                var relative = file.Headers.ContainsKey("Content-Location") ? file.Headers["Content-Location"].ToString() : file.FileName;
                // Se o browser suportar webkitRelativePath, use-o via content-disposition (nem sempre disponível no server side);
                var safeName = Path.GetFileName(relative);
                var subPath = Path.GetDirectoryName(relative) ?? string.Empty;
                var destDir = Path.Combine(targetDir, subPath);
                Directory.CreateDirectory(destDir);
                var destPath = Path.Combine(destDir, safeName);
                using (var stream = System.IO.File.Create(destPath))
                {
                    await file.CopyToAsync(stream);
                }
            }

            // Cria registro de projeto usando LocalPath relativo ao uploadsRoot
            var localPathRelative = Path.Combine(userId.ToString(), projectGuid);

            var newProject = new Project
            {
                UserID = userId,
                Name = form["name"].FirstOrDefault() ?? "(Upload de pasta)",
                Description = form["description"].FirstOrDefault(),
                RepoURL = string.Empty,
                LocalPath = localPathRelative,
                Status = "Pendente",
                SubmittedAt = DateTime.UtcNow,
                LastUpdatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(newProject);
            await _context.SaveChangesAsync();

            // Dispara análise
            _ = Task.Run(() => TriggerPythonAnalysis(Path.Combine(uploadsRoot, localPathRelative), "local", newProject.ProjectID)); // Passa o ProjectID

            var responseDto = new ProjectResponseDto
            {
                ProjectID = newProject.ProjectID,
                UserID = newProject.UserID,
                UserName = user.Username,
                Name = newProject.Name,
                Description = newProject.Description,
                RepoURL = newProject.RepoURL,
                LocalPath = newProject.LocalPath,
                Status = newProject.Status,
                SubmittedAt = newProject.SubmittedAt
            };

            return CreatedAtAction(nameof(GetProjectById), new { id = newProject.ProjectID }, responseDto);
        }

        /// <summary>
        /// Cria um novo projeto a partir da URL de um repositório.
        /// </summary>
        [HttpPost] // A rota agora é simplesmente POST para /ada/users/{userId}/projects
        public async Task<ActionResult<ProjectResponseDto>> CreateProjectForUser(int userId, [FromBody] CreateProjectRequestDto request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound($"Usuário com ID {userId} não encontrado.");
            }

            // Validação: o request deve conter E-OU, mas não ambos: RepoURL OU LocalPath
            var hasRepo = !string.IsNullOrWhiteSpace(request.RepoURL);
            var hasLocal = !string.IsNullOrWhiteSpace(request.LocalPath);

            if (!hasRepo && !hasLocal)
            {
                return BadRequest("É necessário informar ou 'RepoURL' (URL do repositório) ou 'LocalPath' (caminho local do projeto).");
            }

            if (hasRepo && hasLocal)
            {
                return BadRequest("Informe apenas um: 'RepoURL' ou 'LocalPath', não ambos.");
            }

            var newProject = new Project
            {
                UserID = userId,
                Name = request.Name,
                Description = request.Description,
                RepoURL = request.RepoURL ?? string.Empty,
                LocalPath = request.LocalPath,
                Status = "Pendente",
                SubmittedAt = DateTime.UtcNow,
                LastUpdatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(newProject);
            await _context.SaveChangesAsync();

            // Dispara a análise do Python em segundo plano, sem travar a resposta para o usuário
            // Envia ao analisador python um objeto que contém a fonte e o tipo de fonte
            var source = hasLocal ? newProject.LocalPath : newProject.RepoURL;
            var sourceType = hasLocal ? "local" : "remote";
            _ = Task.Run(() => TriggerPythonAnalysis(source, sourceType, newProject.ProjectID)); // Passa o ProjectID

            var responseDto = new ProjectResponseDto
            {
                ProjectID = newProject.ProjectID,
                UserID = newProject.UserID,
                UserName = user.Username,
                Name = newProject.Name,
                Description = newProject.Description,
                RepoURL = newProject.RepoURL,
                LocalPath = newProject.LocalPath,
                Status = newProject.Status,
                SubmittedAt = newProject.SubmittedAt
            };

            return CreatedAtAction(nameof(GetProjectById), new { id = newProject.ProjectID }, responseDto);
        }

        private async Task TriggerPythonAnalysis(string repoUrl, string sourceType, int projectId)
        {
            try
            {
                // URL da nossa nova API Python
                var pythonApiUrl = "http://localhost:5001/analyze";

                // Lê as chaves de API da configuração para evitar hardcoding.
                var githubToken = _configuration["ApiKeys:GitHubToken"];
                var googleApiKey = "AIzaSyDF7SRy6wemtyV8CBzv0amkd4LQARXDRUs";

                if (string.IsNullOrEmpty(githubToken) || string.IsNullOrEmpty(googleApiKey))
                {
                    Console.WriteLine("[.NET ERROR] Chaves de API do GitHub ou Google não configuradas.");
                    return;
                }

                var client = _httpClientFactory.CreateClient();
                var payload = new
                {
                    source = repoUrl,
                    source_type = sourceType,
                    github_token = githubToken,
                    google_api_key = googleApiKey,
                    project_id = projectId // Adiciona o ProjectID ao payload
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                Console.WriteLine($"[.NET] Enviando requisição de análise para: {pythonApiUrl} (sourceType={sourceType})");
                var response = await client.PostAsync(pythonApiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"[.NET SUCCESS] Análise recebida para o projeto {projectId}:\n{responseBody}");
                    
                    // Desserializa o JSON e salva no banco de dados.
                    var analysisResult = JsonSerializer.Deserialize<PythonAnalysisDto>(responseBody, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (analysisResult != null && analysisResult.Sucesso)
                    {
                        // Usamos um novo DbContext aqui porque este método roda em uma thread separada.
                        using var scope = _scopeFactory.CreateScope();
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                        var projectToUpdate = await dbContext.Projects.FindAsync(projectId);
                        if (projectToUpdate != null)
                        {
                            projectToUpdate.Status = "Analisado";
                            projectToUpdate.LastUpdatedAt = DateTime.UtcNow; // Atualiza o timestamp

                            foreach (var avaliacao in analysisResult.AvaliacoesDetalhadas)
                            {
                                projectToUpdate.PythonRatingDetails.Add(new PythonRatingDetail { Criterion = avaliacao.Criterio, Score = avaliacao.Nota, Justification = avaliacao.Justificativa, CreatedAt = DateTime.UtcNow });
                            }
                            await dbContext.SaveChangesAsync();
                            Console.WriteLine($"[.NET SUCCESS] Análise do projeto {projectId} salva no banco de dados.");
                        }
                    }
                }
                else
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"[.NET ERROR] A API Python retornou um erro para o projeto {projectId}. Status: {response.StatusCode}\nDetalhes: {errorBody}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[.NET CRITICAL] Falha ao comunicar com a API Python: {ex.Message}");
            }
        }

        /// <summary>
        /// Faz o download do relatório Markdown de um projeto.
        /// </summary>
        [HttpGet("/ada/projects/{projectId}/download-md")]
        public async Task<IActionResult> DownloadMarkdownReport(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound($"Projeto com ID {projectId} não encontrado.");
            }

            // O relatório é salvo na pasta 'AI/src' do projeto Python
            // O nome do arquivo é padronizado como 'relatorio_projeto_{projectId}.md'
            // Caminho para a pasta AI/src, assumindo que o backend está na pasta 'Back-end'
            // e a pasta 'AI' está no mesmo nível da pasta 'Back-end'.
            var aiSrcPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "AI", "src"));
            var reportPath = Path.Combine(aiSrcPath, $"relatorio_projeto_{projectId}.md");

            if (!System.IO.File.Exists(reportPath))
            {
                // Se o relatório não existe, pode ser que a análise ainda não terminou ou falhou.
                return NotFound($"Relatório Markdown para o projeto {projectId} não encontrado em {reportPath}. A análise pode ainda estar em andamento ou ter falhado.");
            }

            var fileBytes = await System.IO.File.ReadAllBytesAsync(reportPath);
            var fileName = $"relatorio_projeto_{projectId}.md"; // Nome do arquivo para download

            return File(fileBytes, "text/markdown", fileName);
        }

        /// <summary>
        /// Obtém os detalhes da análise de IA para um projeto específico.
        /// </summary>
        [HttpGet("/ada/projects/{projectId}/analysis-details")] // Rota global para detalhes da análise
        public async Task<ActionResult<ProjectAnalysisDetailsDto>> GetProjectAnalysisDetails(int projectId)
        {
            var project = await _context.Projects
                .Include(p => p.PythonRatingDetails) // Inclui os detalhes da avaliação da IA
                .FirstOrDefaultAsync(p => p.ProjectID == projectId);

            if (project == null)
            {
                return NotFound($"Projeto com ID {projectId} não encontrado.");
            }

            // Calcula a pontuação média se houver avaliações
            double? averageScore = null;
            if (project.PythonRatingDetails != null && project.PythonRatingDetails.Any())
            {
                averageScore = project.PythonRatingDetails.Average(r => r.Score);
            }

            var responseDto = new ProjectAnalysisDetailsDto
            {
                ProjectID = project.ProjectID,
                Name = project.Name,
                Description = project.Description,
                RepoURL = project.RepoURL,
                LocalPath = project.LocalPath,
                Status = project.Status,
                AverageScore = averageScore,
                PythonRatingDetails = project.PythonRatingDetails
                    .Select(r => new AvaliacaoDetalhadaDto { Criterio = r.Criterion, Nota = r.Score, Justificativa = r.Justification })
                    .ToList()
            };

            return Ok(responseDto);
        }

        /// <summary>
        /// Obtém um projeto específico pelo ID.
        /// </summary>
        [HttpGet("/ada/projects/{id}")] // Rota global para buscar um projeto por ID
        public async Task<ActionResult<ProjectResponseDto>> GetProjectById(int id)
        {
            var project = await _context.Projects
                .Include(p => p.User) // Inclui os dados do usuário relacionado
                .FirstOrDefaultAsync(p => p.ProjectID == id);

            if (project == null)
            {
                return NotFound();
            }

            var responseDto = new ProjectResponseDto
            {
                ProjectID = project.ProjectID,
                UserID = project.UserID,
                UserName = project.User.Username,
                Name = project.Name,
                Description = project.Description,
                RepoURL = project.RepoURL,
                LocalPath = project.LocalPath,
                Status = project.Status,
                SubmittedAt = project.SubmittedAt
            };

            return Ok(responseDto);
        }

        /// <summary>
        /// Lista todos os projetos.
        /// </summary>
        [HttpGet("/ada/projects/all")] // Rota global para buscar todos os projetos
        public async Task<ActionResult<IEnumerable<ProjectResponseDto>>> GetAllProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.User)
                .Select(p => new ProjectResponseDto
                {
                    ProjectID = p.ProjectID,
                    UserID = p.UserID,
                    UserName = p.User.Username,
                    Name = p.Name,
                    Description = p.Description,
                    RepoURL = p.RepoURL,
                    LocalPath = p.LocalPath,
                    Status = p.Status,
                    SubmittedAt = p.SubmittedAt
                })
                .ToListAsync();

            return Ok(projects);
        }

        /// <summary>
        /// Lista todos os projetos de um usuário específico.
        /// </summary>
        [HttpGet] // A rota agora é simplesmente GET para /ada/users/{userId}/projects
        public async Task<ActionResult<IEnumerable<ProjectResponseDto>>> GetProjectsForUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound($"Usuário com não encontrado.");
            }

            var projects = await _context.Projects
                .Where(p => p.UserID == userId)
                .Include(p => p.User)
                .Select(p => new ProjectResponseDto
                {
                    ProjectID = p.ProjectID,
                    UserID = p.UserID,
                    UserName = p.User.Username,
                    Name = p.Name,
                    Description = p.Description,
                    RepoURL = p.RepoURL,
                    Status = p.Status,
                    SubmittedAt = p.SubmittedAt
                })
                .ToListAsync();

            return Ok(projects);
        }

        /// <summary>
        /// Obtém uma lista de projetos analisados para o ranking, ordenados pela maior nota.
        /// </summary>
        [HttpGet("/ada/projects/ranking")] // Rota global para o ranking
        public async Task<ActionResult<IEnumerable<ProjectAnalysisDetailsDto>>> GetProjectsForRanking()
        {
            var projectsForRanking = await _context.Projects
                .Include(p => p.User)
                .Include(p => p.PythonRatingDetails)
                .Where(p => p.Status == "Analisado" && p.PythonRatingDetails.Any()) // Apenas projetos analisados e com notas
                .Select(p => new ProjectAnalysisDetailsDto
                {
                    ProjectID = p.ProjectID,
                    Name = p.Name,
                    UserName = p.User.Username,
                    SubmittedAt = p.SubmittedAt,
                    Status = p.Status,
                    // Calcula a média das notas dos critérios para ter a pontuação final
                    AverageScore = p.PythonRatingDetails.Average(r => r.Score),
                    // Incluímos os detalhes para possível expansão no frontend
                    PythonRatingDetails = p.PythonRatingDetails
                        .Select(r => new AvaliacaoDetalhadaDto { Criterio = r.Criterion, Nota = r.Score, Justificativa = r.Justification })
                        .ToList()
                })
                .OrderByDescending(p => p.AverageScore) // Ordena pela maior nota
                .ToListAsync();

            return Ok(projectsForRanking);
        }

        /// <summary>
        /// [DEBUG] Lista todos os projetos com seu status atual para depuração.
        /// </summary>
        [HttpGet("/ada/projects/debug-all")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllProjectsForDebug()
        {
            var allProjects = await _context.Projects
                .Include(p => p.User)
                .Select(p => new
                {
                    p.ProjectID,
                    p.Name,
                    p.Status,
                    p.SubmittedAt,
                    p.LastUpdatedAt,
                    UserName = p.User.Username,
                    HasRatingDetails = p.PythonRatingDetails.Any()
                })
                .OrderByDescending(p => p.SubmittedAt)
                .ToListAsync();

            return Ok(allProjects);
        }
    }
}
