using HackathonT2S.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Features;


var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Aumenta limites de upload multipart e do Kestrel para permitir uploads maiores (ex.: 1 GB)
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1024L * 1024L * 1024L; // 1 GB
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartHeadersLengthLimit = int.MaxValue;
});

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 1024L * 1024L * 1024L; // 1 GB
});

// Add services to the container.
// 1. Pega a Connection String do appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Configura o DbContext para usar MySQL com AutoDetect e resiliência
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), mySqlOptions => 
        mySqlOptions.EnableRetryOnFailure()
    )
);

// Adiciona o IHttpClientFactory para fazer chamadas HTTP de forma eficiente
builder.Services.AddHttpClient();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000") // URL do seu front-end
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// 3. Configuração da autenticação JWT (padrão)
var jwtKey = builder.Configuration["Jwt:Key"] ?? string.Empty;
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            // Tornar explícito como o framework deve mapear os claims de nome e role
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role,
            // Pequena folga para evitar falhas por diferenças de relógio
            ClockSkew = TimeSpan.FromSeconds(60)
        };

        // Adiciona handlers para log detalhado de falhas de autenticação
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"[JWT] Authentication failed: {context.Exception?.Message}\nIssuerExpected={jwtIssuer}, AudienceExpected={jwtAudience}");
                if (context.Exception != null)
                {
                    Console.WriteLine(context.Exception);
                }
                return System.Threading.Tasks.Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine($"[JWT] Token validated for {context.Principal?.Identity?.Name} (name identifier: {context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value})");
                return System.Threading.Tasks.Task.CompletedTask;
            }
        };
    });

// Adiciona o serviço de autorização, que funciona em conjunto com a autenticação
builder.Services.AddAuthorization();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Adiciona esta configuração para ignorar ciclos de referência na serialização JSON
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Adiciona definição de segurança para permitir inserir JWT no Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Informe o token JWT usando o esquema: 'Bearer {token}'\n\nExemplo: Bearer eyJhbGci...",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Comentar esta linha desativa o redirecionamento forçado para HTTPS durante o desenvolvimento.
// app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

// Adiciona o middleware de autenticação. É importante que ele venha ANTES do UseAuthorization.
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
