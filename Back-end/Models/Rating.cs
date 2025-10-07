namespace HackathonT2S.Models
{
    public class Rating
    {
        public int RatingID { get; set; }
        public int ProjectID { get; set; }

        // Critérios de Engenharia de Software
        public double FunctionalAdequacy { get; set; }
        public string FunctionalAdequacyJustification { get; set; } = string.Empty;

        public double Maintainability { get; set; }
        public string MaintainabilityJustification { get; set; } = string.Empty;

        public double Reliability { get; set; }
        public string ReliabilityJustification { get; set; } = string.Empty;

        public double Usability { get; set; }
        public string UsabilityJustification { get; set; } = string.Empty;

        public double Performance { get; set; }
        public string PerformanceJustification { get; set; } = string.Empty;

        // Critérios de Qualidade de Aplicação de IA
        public double DataOriginAndProcessing { get; set; }
        public string DataOriginAndProcessingJustification { get; set; } = string.Empty;

        public double AppliedTechniques { get; set; }
        public string AppliedTechniquesJustification { get; set; } = string.Empty;

        public double ValidationAndModelChoice { get; set; }
        public string ValidationAndModelChoiceJustification { get; set; } = string.Empty;

        public double MetricsCostPerformance { get; set; }
        public string MetricsCostPerformanceJustification { get; set; } = string.Empty;

        public double SecurityAndGovernance { get; set; }
        public string SecurityAndGovernanceJustification { get; set; } = string.Empty;

        // Pontuação total calculada
        public double TotalScore { get; set; }

    }
}
