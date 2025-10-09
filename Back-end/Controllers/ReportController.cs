﻿﻿﻿using Microsoft.AspNetCore.Mvc;
using HackathonT2S.Models;
using HackathonT2S.Data;
using System.Threading.Tasks;
using HackathonT2S.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Authorize] // << Adicionado aqui: só usuários autenticados podem acessar este controller
    [Route("ada/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Cria um novo relatório para um projeto.
        /// </summary>
        [HttpPost("/ada/projects/{projectId}/reports")]
        public async Task<ActionResult<ReportResponseDto>> CreateReport(int projectId, [FromBody] CreateReportRequestDto request)
        {
            if (!await _context.Projects.AnyAsync(p => p.ProjectID == projectId))
            {
                return NotFound($"Projeto com ID {projectId} não encontrado.");
            }

            var newReport = new Report
            {
                ProjectID = projectId,
                MarkdownContent = request.MarkdownContent,
                TotalScore = request.TotalScore,
                GeneratedAt = DateTime.UtcNow
            };

            _context.Reports.Add(newReport);
            await _context.SaveChangesAsync();

            var responseDto = new ReportResponseDto
            {
                ReportID = newReport.ReportID,
                ProjectID = newReport.ProjectID,
                GeneratedAt = newReport.GeneratedAt,
                MarkdownContent = newReport.MarkdownContent,
                TotalScore = newReport.TotalScore
            };

            return CreatedAtAction(nameof(GetReportsByProject), new { projectId = newReport.ProjectID }, responseDto);
        }

        /// <summary>
        /// Obtém todos os relatórios de um projeto específico.
        /// </summary>
        [HttpGet("/ada/projects/{projectId}/reports")]
        public async Task<ActionResult<IEnumerable<ReportResponseDto>>> GetReportsByProject(int projectId)
        {
            if (!await _context.Projects.AnyAsync(p => p.ProjectID == projectId))
            {
                return NotFound($"Projeto com ID {projectId} não encontrado.");
            }

            var reports = await _context.Reports
                .Where(r => r.ProjectID == projectId)
                .Select(r => new ReportResponseDto
                {
                    ReportID = r.ReportID,
                    ProjectID = r.ProjectID,
                    GeneratedAt = r.GeneratedAt,
                    MarkdownContent = r.MarkdownContent,
                    TotalScore = r.TotalScore
                })
                .OrderByDescending(r => r.GeneratedAt) // Mostra os mais recentes primeiro
                .ToListAsync();

            return Ok(reports);
        }
    }
}
