using AutoMapper;
using FilmesAPI.Data.Dtos;
using FilmesAPI.Data;
using FilmesAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace FilmesAPI.Controllers;
[ApiController]
[Route("[controller]")]
public class SessaoController : ControllerBase
{
    private FilmeContext _context;
    private IMapper _mapper;

    public SessaoController(FilmeContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpPost]
    public IActionResult AdicionaSessao(CreateSessaoDTO dto)
    {
        Sessao sessao = _mapper.Map<Sessao>(dto);
        _context.Sessoes.Add(sessao);
        _context.SaveChanges();
        return CreatedAtAction(nameof(RecuperaSessoesPorId), new { filmeId = sessao.FilmeId, cinemaId = sessao.CinemaId }, sessao);
    }

    [HttpGet]
    public IEnumerable<ReadSessaoDTO> RecuperaSessoes()
    {
        return _mapper.Map<List<ReadSessaoDTO>>(_context.Sessoes.ToList());
    }

    [HttpGet("{filmeid}/cinemaid")]
    public IActionResult RecuperaSessoesPorId(int filmeid, int cinemaid)
    {
        Sessao sessao = _context.Sessoes.FirstOrDefault(sessao => sessao.FilmeId == filmeid && sessao.CinemaId == cinemaid);
        if (sessao != null)
        {
            ReadSessaoDTO sessaoDto = _mapper.Map<ReadSessaoDTO>(sessao);

            return Ok(sessaoDto);
        }
        return NotFound();
    }
}
