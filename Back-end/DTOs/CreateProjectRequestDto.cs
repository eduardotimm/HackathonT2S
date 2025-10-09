using System.ComponentModel.DataAnnotations;

namespace HackathonT2S.Dtos
{
    public class CreateProjectRequestDto
    {
        [Required] public string Name { get; set; }
        [Required] [Url] public string RepoURL { get; set; }
        public string? Description { get; set; }
    }
}