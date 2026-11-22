using BukkNet.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddMemoryCache();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowBukkNet",
        policyBuilder => policyBuilder
            .WithOrigins("https://localhost:4200", "http://localhost:4200", "http://192.168.100.24:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddHttpClient<IWeatherService, WeatherService>(client =>
{
    client.BaseAddress = new Uri("https://api.met.no/");
    client.DefaultRequestHeaders.UserAgent.ParseAdd("BukkNet/1.0 (balazs_dombi@outlook.com)");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.UseCors("AllowBukkNet");

app.MapGet("/api/weather", async (IWeatherService weatherService, CancellationToken cancellationToken) =>
{
    var items = await weatherService.GetAllAsync(cancellationToken);
    return Results.Ok(items);
})
.WithName("GetAllWeather");

app.MapGet("/api/weather/{locationId}", async (string locationId, IWeatherService weatherService, CancellationToken cancellationToken) =>
{
    var item = await weatherService.GetByLocationIdAsync(locationId, cancellationToken);
    return item is null
        ? Results.NotFound(new { message = $"Ismeretlen helyszín: '{locationId}'" })
        : Results.Ok(item);
})
.WithName("GetWeatherByLocationId");

app.Run();