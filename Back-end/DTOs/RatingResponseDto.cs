namespace HackathonT2S.Dtos
{
    public class RatingResponseDto
    {
        public int RatingID { get; set; }
        public int ProjectID { get; set; }

        public double FunctionalAdequacy { get; set; }
        public string FunctionalAdequacyJustification { get; set; }

        public double Maintainability { get; set; }
        public string MaintainabilityJustification { get; set; }

        public double Reliability { get; set; }
        public string ReliabilityJustification { get; set; }

        public double Usability { get; set; }
        public string UsabilityJustification { get; set; }

        public double Performance { get; set; }
        public string PerformanceJustification { get; set; }

        public double DataOriginAndProcessing { get; set; }
        public string DataOriginAndProcessingJustification { get; set; }

        public double AppliedTechniques { get; set; }
        public string AppliedTechniquesJustification { get; set; }

        public double ValidationAndModelChoice { get; set; }
        public string ValidationAndModelChoiceJustification { get; set; }

        public double MetricsCostPerformance { get; set; }
        public string MetricsCostPerformanceJustification { get; set; }

        public double SecurityAndGovernance { get; set; }
        public string SecurityAndGovernanceJustification { get; set; }

        public double TotalScore { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}