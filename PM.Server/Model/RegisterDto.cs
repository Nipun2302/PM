namespace PM.server.Model
{
    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Role { get; set; } = "User";   // "Admin" or "User"
    }

    public record LoginDto(string Username, string Password);
}
