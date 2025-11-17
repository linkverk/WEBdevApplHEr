namespace BioscoopServer.Models.ModelsDTOs
{
    public class LoginDTO
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class RegisterDTO
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
    }

    public class AuthResponseDTO
    {
        public string Token { get; set; } = null!;
        public UserDTO User { get; set; } = null!;
    }
}