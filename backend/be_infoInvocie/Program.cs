using be_infoInvoice.Database;
using be_infoInvoice.Interfaces;
using be_infoInvoice.Interfaces.Auth;
using be_infoInvoice.Interfaces.Invoice;
using be_infoInvoice.Interfaces.Invoice.Validators;
using be_infoInvoice.Repositories;
using be_infoInvoice.Repositories.Auth;
using be_infoInvoice.Repositories.Invoice;
using be_infoInvoice.Services;
using be_infoInvoice.Services.Auth;
using be_infoInvoice.Services.Auth.Infrastructure;
using be_infoInvoice.Services.Invoice;
using be_infoInvoice.Services.Invoice.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddScoped<IInvoiceIssueRepository, InvoiceIssueRepository>();
builder.Services.AddScoped<IInvoiceIssueService, InvoiceIssueService>();

builder.Services.AddScoped<IInvoiceExportRepository, InvoiceExportRepository>();
builder.Services.AddScoped<IInvoiceExportService, InvoiceExportService>();

builder.Services.AddScoped<IInvoiceCheckRepository, InvoiceCheckRepository>();
builder.Services.AddScoped<IInvoiceCheckService, InvoiceCheckService>();

builder.Services.AddScoped<IInvoicePrintRepository, InvoicePrintRepository>();
builder.Services.AddScoped<IInvoicePrintService, InvoicePrintService>();

builder.Services.AddScoped<ITctRepository, TctRepository>();
builder.Services.AddScoped<ITctService, TctService>();

builder.Services.AddScoped<IInvoiceValidator, InvoiceValidator>();
builder.Services.AddScoped<IUserContext, UserContext>();

builder.Services.AddScoped<IInvoiceListRepository, InvoiceListRepository>();
builder.Services.AddScoped<IInvoiceListService, InvoiceListService>();



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // Cho phép mọi domain
            .AllowAnyMethod()  
            .AllowAnyHeader();  
    });
});

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

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();