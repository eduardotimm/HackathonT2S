using Microsoft.AspNetCore.Mvc;
//Teste

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Route("ada/[controller]")]
    public class ProjectController : ControllerBase
    {
        // Endpoint para submeter URLs de repositórios
        [HttpPost("")]
        public IActionResult SubmitRepository([FromBody] string repositoryUrl)
        {
            // Lógica para iniciar análise assíncrona
            return Ok("Análise iniciada para: " + repositoryUrl);
        }

        // Endpoint para consultar status da análise
        [HttpGet("{id}")]
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

        // Endpoint para listar todos os projetos
        [HttpGet("all")]
        public IActionResult GetAll()
        {
            // Exemplo de retorno estático, substitua pela lógica real
            var projects = new[]
            {
                new { ProjectID = 1, Name = "Projeto A", Status = "Concluído" },
                new { ProjectID = 2, Name = "Projeto B", Status = "Em andamento" }
            };
            return Ok(projects);
        }
    }
}
