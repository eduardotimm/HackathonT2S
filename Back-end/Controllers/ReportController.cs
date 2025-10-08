using Microsoft.AspNetCore.Mvc;
using HackathonT2S.Models;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        // Endpoint para obter relatório de análise em Markdown
        [HttpGet("project/report/{id}")]
        public IActionResult GetReport(int id)
        {
            // Lógica para buscar e retornar o relatório do projeto
            var markdownReport = "# Relatório de Análise\nPontuação: ...";
            return Ok(markdownReport);
        }

        // Endpoint para listar todos os relatórios
        [HttpGet("all")]
        public IActionResult GetAllReports()
        {
            // Exemplo de retorno estático, substitua pela lógica real
            var reports = new[]
            {
                new Report { ReportID = 1, ProjectID = 1, GeneratedAt = DateTime.Now, MarkdownContent = "# Relatório Projeto A", TotalScore = 85.5 },
                new Report { ReportID = 2, ProjectID = 2, GeneratedAt = DateTime.Now, MarkdownContent = "# Relatório Projeto B", TotalScore = 92.0 }
            };
            return Ok(reports);
        }
    }
}
