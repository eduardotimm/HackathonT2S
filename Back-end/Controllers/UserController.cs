using Microsoft.AspNetCore.Mvc;
using HackathonT2S.Models;
using HackathonT2S.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using HackathonT2S.Dtos;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Route("ada/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
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
        public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] User newUser)
        {
            // IMPORTANTE: Em uma aplicação real, a senha nunca deve ser salva em texto plano.
            // Você deve gerar um hash da senha aqui.
            // Ex: newUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newUser.PasswordHash);

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
