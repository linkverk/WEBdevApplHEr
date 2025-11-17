using Microsoft.AspNetCore.Mvc;
using BioscoopServer.models;
using BioscoopServer.DBServices;
using BioscoopServer.Models.ModelsDTOs;
using Microsoft.EntityFrameworkCore;

namespace Controllers
{
    [ApiController]
    [Route("api/Users")]
    public class UserController : ControllerBase
    {
        private readonly DBUserService _DBUserService;
        private readonly CinemaContext _context;

        public UserController(DBUserService DBUserService, CinemaContext context)
        {
            _DBUserService = DBUserService;
            _context = context;
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetUserById([FromQuery] string id)
        {
            if (!Guid.TryParse(id, out var userId))
            {
                return BadRequest("Invalid user ID format");
            }

            var user = await _DBUserService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound($"User with id {id} was not found");
            }

            var userDto = new UserDTO
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };

            return Ok(userDto);
        }

        [HttpGet("GetByEmail")]
        public async Task<IActionResult> GetUserByEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Email is required");
            }

            var user = await _DBUserService.GetByEmailAsync(email);
            if (user == null)
            {
                return NotFound($"User with email {email} was not found");
            }

            var userDto = new UserDTO
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };

            return Ok(userDto);
        }

        [HttpPost("AddOrUpdate")]
        public async Task<IActionResult> AddOrUpdateUser([FromBody] UserDTO userModel)
        {
            if (userModel == null)
                return BadRequest("User data is required");

            Guid userId;
            if (string.IsNullOrWhiteSpace(userModel.Id) || !Guid.TryParse(userModel.Id, out userId))
                userId = Guid.NewGuid();

            // Check if user exists
            var existingUser = await _context.Users.FindAsync(userId);

            if (existingUser != null)
            {
                // UPDATE existing user
                Console.WriteLine($"Updating user: {userId}");
                Console.WriteLine($"Old: {existingUser.FirstName} {existingUser.LastName}");
                Console.WriteLine($"New: {userModel.FirstName} {userModel.LastName}");

                existingUser.Email = userModel.Email;
                existingUser.FirstName = userModel.FirstName;
                existingUser.LastName = userModel.LastName;
                
                // Only update password if provided
                if (!string.IsNullOrWhiteSpace(userModel.Password))
                {
                    existingUser.Password = userModel.Password;
                }

                _context.Users.Update(existingUser);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ User updated successfully!");

                var responseDto = new UserDTO
                {
                    Id = existingUser.Id.ToString(),
                    Email = existingUser.Email,
                    FirstName = existingUser.FirstName,
                    LastName = existingUser.LastName
                };

                return Ok(responseDto);
            }
            else
            {
                // ADD new user
                Console.WriteLine($"Creating new user: {userId}");

                var user = new User
                {
                    Id = userId,
                    Email = userModel.Email,
                    Password = userModel.Password ?? "",
                    FirstName = userModel.FirstName,
                    LastName = userModel.LastName
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ User created successfully!");

                var responseDto = new UserDTO
                {
                    Id = user.Id.ToString(),
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                };

                return Ok(responseDto);
            }
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteUser([FromBody] UserDTO userModel)
        {
            if (userModel == null)
                return BadRequest("User data is required");

            if (!Guid.TryParse(userModel.Id, out var userId))
                return BadRequest("Invalid user ID format");

            var user = await _DBUserService.GetByIdAsync(userId);
            if (user == null)
                return NotFound($"User with id {userModel.Id} was not found");

            await _DBUserService.DeleteAsync(user);
            return Ok(new { message = "User deleted successfully" });
        }

        [HttpGet("GetHistory")]
        public async Task<IActionResult> GetUserHistory([FromQuery] string id)
        {
            if (!Guid.TryParse(id, out var userId))
            {
                return BadRequest("Invalid user ID format");
            }

            var history = await _DBUserService.GetUserHistoryAsync(userId);
            if (history == null)
            {
                return NotFound($"User with id {id} was not found");
            }

            return Ok(history);
        }

        [HttpPost("AddToHistory")]
        public async Task<IActionResult> AddToHistory([FromBody] HistoryDTO historyModel)
        {
            if (historyModel == null || string.IsNullOrWhiteSpace(historyModel.UserId) || string.IsNullOrWhiteSpace(historyModel.FilmId))
            {
                return BadRequest("User ID and Film ID are required");
            }

            if (!Guid.TryParse(historyModel.UserId, out var userId))
            {
                return BadRequest("Invalid user ID format");
            }

            if (!Guid.TryParse(historyModel.FilmId, out var filmId))
            {
                return BadRequest("Invalid film ID format");
            }

            var result = await _DBUserService.AddToHistoryAsync(userId, filmId);
            if (!result)
            {
                return NotFound("User or Film not found");
            }

            return Ok(new { message = "Film added to history successfully" });
        }

        [HttpGet("GetBookings")]
        public async Task<IActionResult> GetUserBookings([FromQuery] string id)
        {
            if (!Guid.TryParse(id, out var userId))
            {
                return BadRequest("Invalid user ID format");
            }

            var bookings = await _DBUserService.GetUserBookingsAsync(userId);
            if (bookings == null)
            {
                return NotFound($"User with id {id} was not found");
            }

            return Ok(bookings);
        }
    }
}