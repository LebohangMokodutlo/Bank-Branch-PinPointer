using System.Text.Json.Serialization;
using BankBranchPinPointer.Api.Configuration;
using BankBranchPinPointer.Api.Services;

var builder = WebApplication.CreateBuilder(args);

const string AllowFrontendPolicy = "AllowFrontend";

var corsOptions = builder.Configuration.GetSection(CorsOptions.SectionName).Get<CorsOptions>()
    ?? new CorsOptions { AllowedOrigins = ["http://localhost:5173"] };

builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowFrontendPolicy, policy =>
        policy.WithOrigins(corsOptions.AllowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// MVC serializes enums as numbers by default; a JSON string ("Gauteng") is far more useful to a
// frontend than an opaque integer, so every controller action returning a Province gets this.
builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Both are plain in-memory singletons: the mock dataset is generated once (deterministically,
// via a fixed random seed) when the first request needs it, then reused for the app's lifetime.
builder.Services.AddSingleton<IBranchRepository, InMemoryBranchRepository>();
builder.Services.AddSingleton<IPlacesSearchService, PlacesSearchService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Bank Branch PinPointer API",
        Version = "v1",
        Description = "Mocked South African bank branch data and a places autocomplete endpoint.",
    });
});

builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Bank Branch PinPointer API v1");
});

app.UseCors(AllowFrontendPolicy);

app.MapHealthChecks("/health");

app.MapControllers();

app.Run();

// Exposes the implicit Program class to WebApplicationFactory<Program> in the integration tests.
public partial class Program { }
