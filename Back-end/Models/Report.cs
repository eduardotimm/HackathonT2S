namespace HackathonT2S.Models
{
    public class Report
    {
        public int ReportID { get; set; }
        public int ProjectID { get; set; }
        public DateTime GeneratedAt { get; set; }
        public string MarkdownContent { get; set; } = string.Empty;
        public double TotalScore { get; set; }
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();


}    }    }
}
