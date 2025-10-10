using System.ComponentModel.DataAnnotations;

namespace HackathonT2S.Dtos
{
    public class CreateProjectRequestDto
    {
        [Required] public string Name { get; set; }
        // Aceita ou uma URL remota OU um caminho local no disco. Validação adicional é feita no controller.
        public string? RepoURL { get; set; }
        public string? LocalPath { get; set; }
        public string? Description { get; set; }
    }
}