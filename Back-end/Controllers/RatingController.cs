using Microsoft.AspNetCore.Mvc;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingController : ControllerBase
    {
        // Endpoint para obter critérios de avaliação
        [HttpGet("criteria")]
        public IActionResult GetCriteria()
        {
            // Retorne os critérios de avaliação definidos no desafio
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
    }
}
