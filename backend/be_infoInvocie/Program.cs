using be_infoInvoice.Database;
using be_infoInvoice.Interfaces;
using be_infoInvoice.Repositories;
using be_infoInvoice.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 🔥 1. Add Controllers
builder.Services.AddControllers();

// 🔥 2. Add DbContext (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 🔥 3. Dependency Injection
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();

var app = builder.Build();

// 🔥 4. Middleware
app.UseHttpsRedirection();

app.UseAuthorization();

// 🔥 5. Map Controllers
app.MapControllers();

app.Run();