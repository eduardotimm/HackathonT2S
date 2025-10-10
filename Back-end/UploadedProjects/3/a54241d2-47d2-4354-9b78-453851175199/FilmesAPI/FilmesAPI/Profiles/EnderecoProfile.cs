using AutoMapper;
using FilmesAPI.Data.Dtos;
using FilmesAPI.Models;

namespace FilmesAPI.Profiles;
public class EnderecoProfile : Profile
{
    public EnderecoProfile()
    {
        CreateMap<CreateEnderecoDTO, Endereco>();
        CreateMap<Endereco, ReadEnderecoDTO>();
        CreateMap<UpdateCinemaDTO, Cinema>();
    }
}
