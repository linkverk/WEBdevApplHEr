using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BioscoopServer.DBServices;

var builder = WebApplication.CreateBuilder(args);

// JWT Configuration
var jwtSecretKey = "YourSuperSecretKeyThatIsAtLeast32CharactersLong!@#$%";
var jwtIssuer = "BioscoopServer";
var jwtAudience = "BioscoopClient";

builder.Services.AddDbContext<CinemaContext>(options =>
    options.UseSqlite("Data Source=cinema.db"));

builder.Services.AddScoped<DBFilmService>();
builder.Services.AddScoped<DBUserService>();
builder.Services.AddScoped<ReviewServices>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddSingleton(new JwtService(jwtSecretKey, jwtIssuer, jwtAudience));

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

Console.WriteLine("🎬 Cinema Server started!");
Console.WriteLine("📡 API running on: http://localhost:5275");
Console.WriteLine("🔐 JWT Authentication enabled");

app.Run();