using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PM.server.Data;
using PM.server.Model;                          // User, RegisterDto, LoginDto
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PM.server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(ProductDbContext db, IConfiguration config) : ControllerBase
{
    private readonly ProductDbContext _db = db;
    private readonly IConfiguration _cfg = config;

    /* ───────────── Register ───────────── */

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
            return BadRequest("Username already exists.");

        var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = hash,
            Role = dto.Role ?? "User"          // "Admin" or "User"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return Ok("User created");
    }

    /* ───────────── Login ───────────── */

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == dto.Username);
        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized();

        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }

    /* ───────────── Token helper ───────────── */

    private string GenerateJwtToken(User user)
    {
        Claim[] claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name,          user.Username),
            new Claim("role",                  user.Role)          // 👈 plain "role"

        ];

        var jwt = _cfg.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(jwt["DurationInMinutes"]!)),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
