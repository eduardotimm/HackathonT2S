using System.ComponentModel.DataAnnotations;

namespace HackathonT2S.Dtos
{
    public class CreateUserRequestDto
    {
        [Required] public string Username { get; set; }
        [Required] [EmailAddress] public string Email { get; set; }
        [Required] [MinLength(6)] public string Password { get; set; }
    }
}