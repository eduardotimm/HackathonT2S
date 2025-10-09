using System.ComponentModel.DataAnnotations;

namespace HackathonT2S.Dtos
{
    public class CreateRatingRequestDto
    {
        [Range(0, 10)] public double FunctionalAdequacy { get; set; }
        public string FunctionalAdequacyJustification { get; set; } = string.Empty;

        [Range(0, 10)] public double Maintainability { get; set; }
        public string MaintainabilityJustification { get; set; } = string.Empty;

        [Range(0, 10)] public double Reliability { get; set; }
        public string ReliabilityJustification { get; set; } = string.Empty;

        [Range(0, 10)] public double Usability { get; set; }
        public string UsabilityJustification { get; set; } = string.Empty;

        [Range(0, 10)] public double Performance { get; set; }
        public string PerformanceJustification { get; set; } = string.Empty;

        [Range(0, 10)] public double DataOriginAndProcessing { get; set; }
        public string DataOriginAndProcessingJustification { get; set; } = string.Empty;

        [Range(0, 10)] public double AppliedTechniques { get; set; }
        public string AppliedTechniquesJustification { get; set; } = string.Empty;

        [Range(0, 10)] public double ValidationAndModelChoice { get; set; }
        public string ValidationAndModelChoiceJustification { get; set; } = string.Empty;

        [Range(0, 10)] public double MetricsCostPerformance { get; set; }
        public string MetricsCostPerformanceJustification { get; set; } = string.Empty;

        [Range(0, 10)] public double SecurityAndGovernance { get; set; }
        public string SecurityAndGovernanceJustification { get; set; } = string.Empty;
    }
}