using Microsoft.AspNetCore.Mvc;
using BioscoopServer.models;
using BioscoopServer.DBServices;
using BioscoopServer.Models.ModelsDTOs;
using BioscoopServer.Services;

namespace Controllers
{
    [ApiController]
    [Route("api/Auth")]
    public class AuthController : ControllerBase
    {
        private readonly DBUserService _userService;
        private readonly JwtService _jwtService;
        private readonly PasswordService _passwordService;
        private readonly CinemaContext _context;

        public AuthController(
            DBUserService userService, 
            JwtService jwtService, 
            PasswordService passwordService,
            CinemaContext context)
        {
            _userService = userService;
            _jwtService = jwtService;
            _passwordService = passwordService;
            _context = context;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto)
        {
            try
            {
                if (registerDto == null)
                    return BadRequest("Registration data is required.");

                // Validate input
                if (string.IsNullOrWhiteSpace(registerDto.Email) || 
                    string.IsNullOrWhiteSpace(registerDto.Password) ||
                    string.IsNullOrWhiteSpace(registerDto.FirstName) ||
                    string.IsNullOrWhiteSpace(registerDto.LastName))
                {
                    return BadRequest("All fields are required.");
                }

                // Check if user already exists
                var existingUser = await _userService.GetByEmailAsync(registerDto.Email);
                if (existingUser != null)
                {
                    return BadRequest("User with this email already exists.");
                }

                // Hash the password
                var hashedPassword = _passwordService.HashPassword(registerDto.Password);

                // Create new user
                var newUser = new User
                {
                    Id = Guid.NewGuid(),
                    Email = registerDto.Email,
                    Password = hashedPassword,
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName
                };

                await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ User registered: {newUser.Email} with ID: {newUser.Id}");

                // Generate JWT token
                var token = _jwtService.GenerateToken(newUser);

                // Create response
                var userDto = new UserDTO
                {
                    Id = newUser.Id.ToString(),
                    Email = newUser.Email,
                    FirstName = newUser.FirstName,
                    LastName = newUser.LastName
                };

                var response = new AuthResponseDTO
                {
                    Token = token,
                    User = userDto
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Registration error: {ex.Message}");
                return StatusCode(500, "An error occurred during registration.");
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            try
            {
                if (loginDto == null)
                    return BadRequest("Login data is required.");

                // Validate input
                if (string.IsNullOrWhiteSpace(loginDto.Email) || 
                    string.IsNullOrWhiteSpace(loginDto.Password))
                {
                    return BadRequest("Email and password are required.");
                }

                // Find user by email
                var user = await _userService.GetByEmailAsync(loginDto.Email);
                if (user == null)
                {
                    return Unauthorized("Invalid email or password.");
                }

                // Verify password
                if (!_passwordService.VerifyPassword(loginDto.Password, user.Password))
                {
                    return Unauthorized("Invalid email or password.");
                }

                Console.WriteLine($"✅ User logged in: {user.Email}");

                // Generate JWT token
                var token = _jwtService.GenerateToken(user);

                // Create response
                var userDto = new UserDTO
                {
                    Id = user.Id.ToString(),
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                };

                var response = new AuthResponseDTO
                {
                    Token = token,
                    User = userDto
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Login error: {ex.Message}");
                return StatusCode(500, "An error occurred during login.");
            }
        }

        [HttpGet("ValidateToken")]
        public IActionResult ValidateToken()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                
                if (string.IsNullOrEmpty(token))
                    return Unauthorized("No token provided.");

                var principal = _jwtService.ValidateToken(token);
                
                if (principal == null)
                    return Unauthorized("Invalid token.");

                var userId = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                var email = principal.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

                return Ok(new { 
                    valid = true, 
                    userId = userId,
                    email = email 
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Token validation error: {ex.Message}");
                return Unauthorized("Invalid token.");
            }
        }
    }
}