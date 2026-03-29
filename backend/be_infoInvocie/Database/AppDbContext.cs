using be_infoInvoice.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace be_infoInvoice.Database;

//Contructor
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    //DBset<T> - Mapping 
    public DbSet<Provider> Providers { get; set; } //Dbset: Providers, DB: providers, Entity: Provider
    public DbSet<InvoiceSession> InvoiceSessions { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    
    //config mapping class <-> db
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //defaut get class name for table name but override
        modelBuilder.Entity<Provider>().ToTable("providers");
        modelBuilder.Entity<InvoiceSession>().ToTable("invoice_sessions");
        modelBuilder.Entity<RefreshToken>().ToTable("refresh_tokens");
    }
}