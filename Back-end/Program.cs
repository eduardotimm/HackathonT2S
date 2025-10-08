using HackathonT2S.Data;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//Configura��o DBContext
builder.Services.AddDbContext<AppDBContext>(options => options.UseMySql(
    builder.Configuration.GetConnectionString("Default Connection"),
    new MySqlServerVersion(new Version(8,0,36))
    )
);


builder.Services.AddControllers();
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
