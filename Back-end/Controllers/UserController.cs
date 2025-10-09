using Microsoft.AspNetCore.Mvc;
using HackathonT2S.Models;
using HackathonT2S.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using HackathonT2S.Dtos;
using HackathonT2S.Services;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Route("ada/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public UserController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _tokenService = new TokenService(configuration);
        }

        /// <summary>
        /// Lista todos os usuários.
        /// </summary>a
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers() 
        {
            var users = await _context.Users
                .Select(u => new UserResponseDto
                {
                    UserID = u.UserID,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// Obtém um usuário específico pelo ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound($"Usuário com ID {id} não encontrado.");
            }

            var userDto = new UserResponseDto
            {
                UserID = user.UserID,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };

            return Ok(userDto);
        }

        /// <summary>
        /// Cria um novo usuário.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] CreateUserRequestDto request)
        {
            // 1. Validação: Verifica se o e-mail já está em uso.
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return Conflict("Este e-mail já está em uso.");
            }

            // 2. Mapeamento do DTO para o Modelo de Domínio
            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                // A senha é transformada em um "hash" seguro. Nunca armazene senhas em texto plano.
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "User" // Define um papel padrão
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var userDto = new UserResponseDto
            {
                UserID = newUser.UserID,
                Username = newUser.Username,
                Email = newUser.Email,
                Role = newUser.Role
            };

            return CreatedAtAction(nameof(GetUser), new { id = newUser.UserID }, userDto);
        }

        /// <summary>
        /// Autentica um usuário e retorna um token.
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            // 1. Encontra o usuário pelo e-mail
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // 2. Verifica se o usuário existe e se a senha está correta
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                // Usamos uma mensagem genérica para não informar se o e-mail existe ou não.
                return Unauthorized("E-mail ou senha inválidos.");
            }

            // 3. Gera o token JWT
            var token = _tokenService.GenerateToken(user);

            var loginResponse = new LoginResponseDto
            {
                UserID = user.UserID,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                Token = token // Retorna o token para o cliente
            };

            return Ok(loginResponse);
        }


        /// <summary>
        /// Deleta um usuário.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent(); // Sucesso, sem conteúdo para retornar.
        }
    }
}
