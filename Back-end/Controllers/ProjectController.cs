﻿﻿﻿using Microsoft.AspNetCore.Mvc;
using HackathonT2S.Data;
using HackathonT2S.Dtos;
using System.Threading.Tasks;
using HackathonT2S.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Authorize] // << Adicionado: Agora todas as ações de projeto exigem login.
    [Route("ada/users/{userId}/projects")] // Rota base para projetos de um usuário
    public class ProjectController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectController(AppDbContext context)
        {
            _context = context;
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
