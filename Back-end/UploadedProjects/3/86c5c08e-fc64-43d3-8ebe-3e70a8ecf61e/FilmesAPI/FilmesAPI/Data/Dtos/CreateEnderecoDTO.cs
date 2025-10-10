using System.ComponentModel.DataAnnotations;

namespace FilmesAPI.Data.Dtos;

public class CreateEnderecoDTO
{
    [Required(ErrorMessage = "Um Logradouro é obrigatório")]
    public string Logradouro { get; set; }
    [Required(ErrorMessage = "Um número é obrigatorio")]
    public int Numero { get; set; }
}
