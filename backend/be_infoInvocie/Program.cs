using be_infoInvoice.Database;
using be_infoInvoice.Interfaces;
using be_infoInvoice.Interfaces.Auth;
using be_infoInvoice.Interfaces.Invoice;
using be_infoInvoice.Repositories.Auth;
using be_infoInvoice.Repositories.Invoice;
using be_infoInvoice.Services.Auth;
using be_infoInvoice.Services.Invoice;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using be_infoInvoice.Repositories;
using be_infoInvoice.Services;

var builder = WebApplication.CreateBuilder(args);

// 🔥 1. Add Controllers
builder.Services.AddControllers();

// 🔥 2. Add DbContext (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 🔥 3. Dependency Injection — theo từng module
// Auth
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// Invoice Issue / Replace / Adjust
builder.Services.AddScoped<IInvoiceIssueRepository, InvoiceIssueRepository>();
builder.Services.AddScoped<IInvoiceIssueService, InvoiceIssueService>();

// Invoice Export XML
builder.Services.AddScoped<IInvoiceExportRepository, InvoiceExportRepository>();
builder.Services.AddScoped<IInvoiceExportService, InvoiceExportService>();

// Invoice Check Tax Status
builder.Services.AddScoped<IInvoiceCheckRepository, InvoiceCheckRepository>();
builder.Services.AddScoped<IInvoiceCheckService, InvoiceCheckService>();

// Invoice Print PDF
builder.Services.AddScoped<IInvoicePrintRepository, InvoicePrintRepository>();
builder.Services.AddScoped<IInvoicePrintService, InvoicePrintService>();

// TCT
builder.Services.AddScoped<ITctRepository, TctRepository>();
builder.Services.AddScoped<ITctService, TctService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // Cho phép mọi nguồn (Domain)
            .AllowAnyMethod()   // Cho phép mọi phương thức (GET, POST, PUT, DELETE...)
            .AllowAnyHeader();  // Cho phép mọi Header
    });
});

// 🔥 3.1 Cấu hình Authentication & JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

var app = builder.Build();

// 🔥 4. Middleware
app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

// 🔥 5. Map Controllers
app.MapControllers();

app.Run();