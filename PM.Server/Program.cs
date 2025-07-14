using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PM.server.Data;
using PM.server.Model;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────── services

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p =>
        p.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader());
});

// DbContext
builder.Services.AddDbContext<ProductDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT
var jwt = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["Key"]!))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// ─────────────────────────── pipeline

app.UseCors("AllowAll");        // 1️⃣  CORS first
app.UseAuthentication();        // 2️⃣  JWT validation
app.UseAuthorization();         // 3️⃣  policy checks

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseStaticFiles();               //  wwwroot is now public

app.MapControllers();           // 4️⃣  endpoints

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ProductDbContext>();

    if (!db.Users.Any(u => u.Role == "Admin"))
    {
        var hash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
        db.Users.Add(new User
        {
            Username = "admin",
            PasswordHash = hash,
            Role = "Admin"
        });
        db.SaveChanges();
        Console.WriteLine("Seeded admin / Admin@123");
    }
}

app.Run();
