using Microsoft.AspNetCore.Mvc;
using HackathonT2S.Models;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Route("ada/[controller]")]
    public class RatingController : ControllerBase
    {
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

        // Endpoint para submeter uma avaliação de projeto
        [HttpPost("")]
        public IActionResult SubmitRating([FromBody] Rating rating)
        {
            // Lógica para salvar a avaliação (Rating) do projeto
            // Exemplo: salvar no banco de dados (não implementado)
            return Ok(new { message = "Avaliação recebida!", rating });
        }

        // Endpoint para obter todas as avaliações de um projeto
        [HttpGet("project/rating")]
        public IActionResult GetRatingsByProject(int projectId)
        {
            // Exemplo de retorno estático, substitua pela lógica real
            var ratings = new[]
            {
                new Rating
                {
                    RatingID = 1,
                    ProjectID = projectId,
                    FunctionalAdequacy = 8.5,
                    FunctionalAdequacyJustification = "README completo e coerente.",
                    Maintainability = 9.0,
                    MaintainabilityJustification = "Código bem comentado e padronizado.",
                    Reliability = 7.5,
                    ReliabilityJustification = "Possui testes automatizados.",
                    Usability = 8.0,
                    UsabilityJustification = "Documentação clara.",
                    Performance = 8.5,
                    PerformanceJustification = "Execução rápida.",
                    DataOriginAndProcessing = 9.0,
                    DataOriginAndProcessingJustification = "Dados bem tratados.",
                    AppliedTechniques = 8.0,
                    AppliedTechniquesJustification = "Utiliza engenharia de prompt.",
                    ValidationAndModelChoice = 7.5,
                    ValidationAndModelChoiceJustification = "Justificativa para escolha do modelo.",
                    MetricsCostPerformance = 8.0,
                    MetricsCostPerformanceJustification = "Métricas bem definidas.",
                    SecurityAndGovernance = 9.0,
                    SecurityAndGovernanceJustification = "Possui guardrails.",
                    TotalScore = 8.3
                }
            };
            return Ok(ratings);
        }
    }
}
