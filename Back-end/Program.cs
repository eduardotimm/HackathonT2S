using HackathonT2S.Data;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// 1. Pega a Connection String do appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Configura o DbContext para usar MySQL com AutoDetect e resiliência
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), mySqlOptions => 
        mySqlOptions.EnableRetryOnFailure()
    )
);

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Adiciona esta configuração para ignorar ciclos de referência na serialização JSON
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
