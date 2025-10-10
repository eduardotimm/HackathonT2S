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

            var newProject = new Project
            {
                UserID = userId,
                Name = request.Name,
                Description = request.Description,
                RepoURL = request.RepoURL,
                Status = "Pendente",
                SubmittedAt = DateTime.UtcNow,
                LastUpdatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(newProject);
            await _context.SaveChangesAsync();

            // Dispara a análise do Python em segundo plano, sem travar a resposta para o usuário
            _ = Task.Run(() => TriggerPythonAnalysis(newProject.RepoURL, newProject.ProjectID));

            var responseDto = new ProjectResponseDto
            {
                ProjectID = newProject.ProjectID,
                UserID = newProject.UserID,
                UserName = user.Username,
                Name = newProject.Name,
                Description = newProject.Description,
                RepoURL = newProject.RepoURL,
                Status = newProject.Status,
                SubmittedAt = newProject.SubmittedAt
            };

            return CreatedAtAction(nameof(GetProjectById), new { id = newProject.ProjectID }, responseDto);
        }

        private async Task TriggerPythonAnalysis(string repoUrl, int projectId)
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
                    github_token = githubToken,
                    google_api_key = googleApiKey
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                Console.WriteLine($"[.NET] Enviando requisição de análise para: {pythonApiUrl}");
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
