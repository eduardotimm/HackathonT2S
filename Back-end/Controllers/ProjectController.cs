﻿﻿﻿using Microsoft.AspNetCore.Mvc;
using HackathonT2S.Data;
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

        public ProjectController(AppDbContext context, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
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
            _ = Task.Run(() => TriggerPythonAnalysis(Path.Combine(uploadsRoot, localPathRelative), "local", newProject.ProjectID));

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
            _ = Task.Run(() => TriggerPythonAnalysis(source, sourceType, newProject.ProjectID));

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

                // Chaves de API (ainda hardcoded para simplificar, mas poderiam vir da configuração)
                var githubToken = "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";
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
                    google_api_key = googleApiKey
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                Console.WriteLine($"[.NET] Enviando requisição de análise para: {pythonApiUrl} (sourceType={sourceType})");
                var response = await client.PostAsync(pythonApiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"[.NET SUCCESS] Análise recebida para o projeto {projectId}:\n{responseBody}");
                    // PRÓXIMO PASSO: Desserializar o JSON e salvar no banco de dados.
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
    }
}
