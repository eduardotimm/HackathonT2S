using System.Collections.Generic;

namespace HackathonT2S.Dtos
{
    public class ProjectAnalysisDetailsDto
    {
        public int ProjectID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string RepoURL { get; set; } = string.Empty;
        public string? LocalPath { get; set; }
        public string Status { get; set; } = string.Empty;
        public double? AverageScore { get; set; } // Pontuação média da IA
        public List<AvaliacaoDetalhadaDto> PythonRatingDetails { get; set; } = new(); // Reusing the DTO from PythonAnalysisDto
    }
}