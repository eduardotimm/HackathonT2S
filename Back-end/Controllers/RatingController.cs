﻿using Microsoft.AspNetCore.Mvc;
using HackathonT2S.Models;
using HackathonT2S.Data;
using System.Threading.Tasks;
using HackathonT2S.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Route("ada/[controller]")]
    public class RatingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RatingController(AppDbContext context)
        {
            _context = context;
        }

        // Endpoint para obter critérios de avaliação
        [HttpGet("criteria")]
        public IActionResult GetCriteria()
        {
            var criteria = new[]
            {
                "Adequação Funcional",
                "Manutenibilidade",
                "Confiabilidade",
                "Usabilidade",
                "Desempenho",
                "Origem e Tratamento dos Dados",
                "Técnicas Aplicadas",
                "Validação e Escolha de Modelos",
                "Métricas de Avaliação, Custo e Desempenho",
                "Segurança e Governança"
            };
            return Ok(criteria);
        }

        /// <summary>
        /// Submete uma nova avaliação para um projeto.
        /// </summary>
        [HttpPost("/ada/projects/{projectId}/ratings")]
        public async Task<ActionResult<RatingResponseDto>> SubmitRating(int projectId, [FromBody] CreateRatingRequestDto request)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound($"Projeto com ID {projectId} não encontrado.");
            }

            var newRating = new Rating
            {
                ProjectID = projectId,
                FunctionalAdequacy = request.FunctionalAdequacy,
                FunctionalAdequacyJustification = request.FunctionalAdequacyJustification,
                Maintainability = request.Maintainability,
                MaintainabilityJustification = request.MaintainabilityJustification,
                Reliability = request.Reliability,
                ReliabilityJustification = request.ReliabilityJustification,
                Usability = request.Usability,
                UsabilityJustification = request.UsabilityJustification,
                Performance = request.Performance,
                PerformanceJustification = request.PerformanceJustification,
                DataOriginAndProcessing = request.DataOriginAndProcessing,
                DataOriginAndProcessingJustification = request.DataOriginAndProcessingJustification,
                AppliedTechniques = request.AppliedTechniques,
                AppliedTechniquesJustification = request.AppliedTechniquesJustification,
                ValidationAndModelChoice = request.ValidationAndModelChoice,
                ValidationAndModelChoiceJustification = request.ValidationAndModelChoiceJustification,
                MetricsCostPerformance = request.MetricsCostPerformance,
                MetricsCostPerformanceJustification = request.MetricsCostPerformanceJustification,
                SecurityAndGovernance = request.SecurityAndGovernance,
                SecurityAndGovernanceJustification = request.SecurityAndGovernanceJustification,
                CreatedAt = DateTime.UtcNow // Adiciona o timestamp da criação
            };

            // Lógica simples para calcular a pontuação total (média das notas)
            newRating.TotalScore = (newRating.FunctionalAdequacy + newRating.Maintainability + newRating.Reliability + newRating.Usability + newRating.Performance + newRating.DataOriginAndProcessing + newRating.AppliedTechniques + newRating.ValidationAndModelChoice + newRating.MetricsCostPerformance + newRating.SecurityAndGovernance) / 10.0;

            _context.Ratings.Add(newRating);
            await _context.SaveChangesAsync();

            // Mapear para o DTO de resposta
            var responseDto = new RatingResponseDto
            {
                RatingID = newRating.RatingID,
                ProjectID = newRating.ProjectID,
                FunctionalAdequacy = newRating.FunctionalAdequacy,
                FunctionalAdequacyJustification = newRating.FunctionalAdequacyJustification,
                Maintainability = newRating.Maintainability,
                MaintainabilityJustification = newRating.MaintainabilityJustification,
                Reliability = newRating.Reliability,
                ReliabilityJustification = newRating.ReliabilityJustification,
                Usability = newRating.Usability,
                UsabilityJustification = newRating.UsabilityJustification,
                Performance = newRating.Performance,
                PerformanceJustification = newRating.PerformanceJustification,
                DataOriginAndProcessing = newRating.DataOriginAndProcessing,
                DataOriginAndProcessingJustification = newRating.DataOriginAndProcessingJustification,
                AppliedTechniques = newRating.AppliedTechniques,
                AppliedTechniquesJustification = newRating.AppliedTechniquesJustification,
                ValidationAndModelChoice = newRating.ValidationAndModelChoice,
                ValidationAndModelChoiceJustification = newRating.ValidationAndModelChoiceJustification,
                MetricsCostPerformance = newRating.MetricsCostPerformance,
                MetricsCostPerformanceJustification = newRating.MetricsCostPerformanceJustification,
                SecurityAndGovernance = newRating.SecurityAndGovernance,
                SecurityAndGovernanceJustification = newRating.SecurityAndGovernanceJustification,
                TotalScore = newRating.TotalScore,
                CreatedAt = newRating.CreatedAt
            };

            return CreatedAtAction(nameof(GetRatingsByProject), new { projectId = newRating.ProjectID }, responseDto);
        }

        /// <summary>
        /// Obtém todas as avaliações de um projeto específico.
        /// </summary>
        [HttpGet("/ada/projects/{projectId}/ratings")]
        public async Task<ActionResult<IEnumerable<RatingResponseDto>>> GetRatingsByProject(int projectId)
        {
            if (!await _context.Projects.AnyAsync(p => p.ProjectID == projectId))
            {
                return NotFound($"Projeto com ID {projectId} não encontrado.");
            }

            var ratings = await _context.Ratings
                .Where(r => r.ProjectID == projectId)
                .Select(r => new RatingResponseDto
                {
                    RatingID = r.RatingID,
                    ProjectID = r.ProjectID,
                    FunctionalAdequacy = r.FunctionalAdequacy,
                    FunctionalAdequacyJustification = r.FunctionalAdequacyJustification,
                    Maintainability = r.Maintainability,
                    MaintainabilityJustification = r.MaintainabilityJustification,
                    Reliability = r.Reliability,
                    ReliabilityJustification = r.ReliabilityJustification,
                    Usability = r.Usability,
                    UsabilityJustification = r.UsabilityJustification,
                    Performance = r.Performance,
                    PerformanceJustification = r.PerformanceJustification,
                    DataOriginAndProcessing = r.DataOriginAndProcessing,
                    DataOriginAndProcessingJustification = r.DataOriginAndProcessingJustification,
                    AppliedTechniques = r.AppliedTechniques,
                    AppliedTechniquesJustification = r.AppliedTechniquesJustification,
                    ValidationAndModelChoice = r.ValidationAndModelChoice,
                    ValidationAndModelChoiceJustification = r.ValidationAndModelChoiceJustification,
                    MetricsCostPerformance = r.MetricsCostPerformance,
                    MetricsCostPerformanceJustification = r.MetricsCostPerformanceJustification,
                    SecurityAndGovernance = r.SecurityAndGovernance,
                    SecurityAndGovernanceJustification = r.SecurityAndGovernanceJustification,
                    TotalScore = r.TotalScore,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(ratings);
        }
    }
}
