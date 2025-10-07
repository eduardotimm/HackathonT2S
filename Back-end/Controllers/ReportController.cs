using Microsoft.AspNetCore.Mvc;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        // Endpoint para obter relatório de análise em Markdown
        [HttpGet("{projectId}")]
        public IActionResult GetReport(int projectId)
        {
            // Lógica para buscar e retornar o relatório do projeto
            var markdownReport = "# Relatório de Análise\nPontuação: ...";
            return Ok(markdownReport);
        }
    }
}
