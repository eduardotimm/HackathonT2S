using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace HackathonT2S.Dtos
{
    public class PythonAnalysisDto
    {
        [JsonPropertyName("sucesso")]
        public bool Sucesso { get; set; }

        [JsonPropertyName("pontuacao_media")]
        public double PontuacaoMedia { get; set; }

        [JsonPropertyName("avaliacoes_detalhadas")]
        public List<AvaliacaoDetalhadaDto> AvaliacoesDetalhadas { get; set; } = new();
    }

    public class AvaliacaoDetalhadaDto
    {
        [JsonPropertyName("criterio")] public string Criterio { get; set; } = string.Empty;
        [JsonPropertyName("nota")] public int Nota { get; set; }
        [JsonPropertyName("justificativa")] public string Justificativa { get; set; } = string.Empty;
    }
}