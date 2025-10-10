namespace HackathonT2S.Dtos
{
    public class ProjectResponseDto
    {
        public int ProjectID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; } // Nome do dono do projeto
        public string Name { get; set; }
        public string? Description { get; set; }
    public string RepoURL { get; set; }
    public string? LocalPath { get; set; }
        public string Status { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}