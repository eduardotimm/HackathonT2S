using System.ComponentModel.DataAnnotations;

namespace FilmesAPI.Models;

public class Endereco
{
    [Key]
    [Required]
    public int Id { get; set; }
    [Required(ErrorMessage = "Um Logradouro é obrigatório")]
    public string Logradouro { get; set; }
    [Required(ErrorMessage = "Um número é obrigatorio")]
    public int Numero { get; set; }

    public virtual Cinema Cinema { get; set; }
}
