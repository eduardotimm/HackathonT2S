using Microsoft.AspNetCore.Mvc;
using HackathonT2S.Models;
using System.Collections.Generic;
using System.Linq;

namespace HackathonT2S.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        // Usando uma lista estática em memória para simular um banco de dados.
        // O ideal é substituir isso pela injeção do seu AppDBContext.
        private static readonly List<User> _users = new List<User>
        {
            new User { UserID = 1, Username = "admin", Email = "admin@example.com", Role = "Admin", PasswordHash = "hash_admin" },
            new User { UserID = 2, Username = "guest", Email = "guest@example.com", Role = "User", PasswordHash = "hash_guest" }
        };

        /// <summary>
        /// Lista todos os usuários.
        /// </summary>
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            // ATENÇÃO: Em uma aplicação real, nunca exponha o PasswordHash.
            // Crie um DTO (Data Transfer Object) para retornar apenas os dados seguros.
            return Ok(_users);
        }

        /// <summary>
        /// Obtém um usuário específico pelo ID.
        /// </summary>
        [HttpGet("{id}")]
        public ActionResult<User> GetUser(int id)
        {
            var user = _users.FirstOrDefault(u => u.UserID == id);

            if (user == null)
            {
                return NotFound($"Usuário com ID {id} não encontrado.");
            }

            return Ok(user);
        }

        /// <summary>
        /// Cria um novo usuário.
        /// </summary>
        [HttpPost]
        public ActionResult<User> CreateUser([FromBody] User newUser)
        {
            // Lógica simples para gerar um novo ID.
            newUser.UserID = _users.Any() ? _users.Max(u => u.UserID) + 1 : 1;
            
            // Lembre-se de gerar o hash da senha antes de salvar!
            // newUser.PasswordHash = GerarHash(newUser.Password);

            _users.Add(newUser);

            return CreatedAtAction(nameof(GetUser), new { id = newUser.UserID }, newUser);
        }

        /// <summary>
        /// Deleta um usuário.
        /// </summary>
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _users.FirstOrDefault(u => u.UserID == id);
            if (user == null)
            {
                return NotFound();
            }

            _users.Remove(user);
            return NoContent(); // Sucesso, sem conteúdo para retornar.
        }
    }
}
