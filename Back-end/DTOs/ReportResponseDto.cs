namespace HackathonT2S.Dtos
{
    public class ReportResponseDto
    {
        public int ReportID { get; set; }
        public int ProjectID { get; set; }
        public DateTime GeneratedAt { get; set; }
        public string MarkdownContent { get; set; }
        public double TotalScore { get; set; }
    }
}