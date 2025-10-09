using System.ComponentModel.DataAnnotations;

namespace HackathonT2S.Dtos
{
    public class CreateReportRequestDto
    {
        [Required] public string MarkdownContent { get; set; }

        [Required] [Range(0, 100)] public double TotalScore { get; set; }
    }
}