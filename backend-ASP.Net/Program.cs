using JanTaskTracker.Server.Models;
using JanTaskTracker.Server.Repositories;
using JanTaskTracker.Server;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevClient",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:8100") // Ionic dev server
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Register DbContext with retry policy for transient fault handling
builder.Services.AddDbContext<JanTaskTrackerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")).EnableSensitiveDataLogging());

// Register repositories and services for dependency injection
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IProjectTaskRepository, ProjectTaskRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularDevClient");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
