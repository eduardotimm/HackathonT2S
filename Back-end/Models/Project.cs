namespace HackathonT2S.Models
{
    public class Project
    {
        
        public int ProjectID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string RepoURL { get; set; } = string.Empty;
        public string Status { get; set; } = "Pendente";
        public double? Score { get; set; }
        public DateTime SubmittedAt { get; set; }
        public string? MarkdownReport { get; set; }
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }
}
