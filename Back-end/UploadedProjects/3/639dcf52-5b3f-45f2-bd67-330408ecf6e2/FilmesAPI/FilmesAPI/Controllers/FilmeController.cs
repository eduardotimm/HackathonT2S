using AutoMapper;
using FilmesAPI.Data;
using FilmesAPI.Data.Dtos;
using FilmesAPI.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace FilmesAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class FilmeController : ControllerBase
{
    private FilmeContext _ctx;
    private IMapper _mapper;

    public FilmeController(FilmeContext ctx, IMapper mapper)
    {
        _ctx = ctx;
        _mapper = mapper;
    }

    /// <summary>
    /// Adiciona um filme ao banco de dados
    /// </summary>
    /// <param name="filmeDto">Objeto com os campos necessários para criação de um filme</param>
    /// <returns>IActionResult</returns>
    /// <response code="201">Caso inserção seja feita com sucesso</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public IActionResult AddFilme([FromBody] CreateFilmeDTO filmeDto)
    {
        Filme filme = _mapper.Map<Filme>(filmeDto);
        _ctx.Filmes.Add(filme);
        _ctx.SaveChanges();
        return CreatedAtAction(nameof(GetFilmeById), new { id = filme.Id }, filme); //"Documenta" o caminho que voce ira encontrar o objeto criado
    }

    [HttpGet]
    public IEnumerable<ReadFilmeDTO> GetFilmes([FromQuery] int skip = 0, [FromQuery] int take = 50, [FromQuery] string? nomeCinema = null) //Explicitando que os parametros serao passado atraves da url
    {
        if(nomeCinema == null)
        {
            return _mapper.Map<List<ReadFilmeDTO>>(_ctx.Filmes.Skip(skip).Take(take).ToList()); //paginacao
        }
        return _mapper.Map<List<ReadFilmeDTO>>(_ctx.Filmes.Skip(skip).Take(take).Where(filme => filme.Sessoes.Any(sessao => sessao.Cinema.Nome == nomeCinema)).ToList()); //paginacao
    }   

    [HttpGet("{id}")] //Diferenciando do get default
    public IActionResult GetFilmeById(int id) 
    {
        var filme = _ctx.Filmes.FirstOrDefault(f => f.Id == id);
        if (filme == null) return NotFound();
        var filmeDto = _mapper.Map<ReadFilmeDTO>(filme);
        return Ok(filmeDto);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateFilme(int id, [FromBody] UpdateFilmeDTO filmeDto)
    {
        var filme = _ctx.Filmes.FirstOrDefault(f => f.Id == id);
        if (filme == null) return NotFound();
        _mapper.Map(filmeDto, filme);
        _ctx.SaveChanges();
        return NoContent();
    }


    [HttpPatch("{id}")]
    public IActionResult UpdateParcialFilme(int id, JsonPatchDocument<UpdateFilmeDTO> patch)
    {
        var filme = _ctx.Filmes.FirstOrDefault(f => f.Id == id);
        if (filme == null) return NotFound();
        var filmeAtt = _mapper.Map<UpdateFilmeDTO>(filme);
        patch.ApplyTo(filmeAtt, ModelState);
        if (!TryValidateModel(filmeAtt))
        {
            return ValidationProblem();
        }
        _mapper.Map(filmeAtt, filme);
        _ctx.SaveChanges();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteFilme(int id)
    {
        var filme = _ctx.Filmes.FirstOrDefault(f => f.Id == id);
        if (filme == null) return NotFound();
        _ctx.Remove(filme);
        _ctx.SaveChanges();
        return NoContent();
    }
}
