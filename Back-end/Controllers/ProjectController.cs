using Microsoft.AspNetCore.Mvc;
//Teste

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        // Endpoint para submeter URLs de repositórios
        [HttpPost("submit")]
        public IActionResult SubmitRepository([FromBody] string repositoryUrl)
        {
            // Lógica para iniciar análise assíncrona
            return Ok("Análise iniciada para: " + repositoryUrl);
        }

        // Endpoint para consultar status da análise
        [HttpGet("status/{id}")]
        public IActionResult GetStatus(int id)
        {
            // Lógica para retornar status
            return Ok(new { id, status = "Em andamento" });
        }

        // Endpoint para obter relatório em Markdown
        [HttpGet("report/{id}")]
        public IActionResult GetReport(int id)
        {
            // Lógica para retornar relatório
            return Ok("# Relatório de Análise\nPontuação: ...");
        }
    }
}
