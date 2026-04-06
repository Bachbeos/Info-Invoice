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
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<InvoiceItem> InvoiceItems { get; set; }
    public DbSet<InvoiceCustomer> InvoiceCustomers { get; set; }
    public DbSet<TaxCheckHistory> TaxCheckHistories { get; set; }
    public DbSet<TctAccount> TctAccounts { get; set; }
    public DbSet<TctSession> TctSessions { get; set; }
    public DbSet<TctInvoice> TctInvoices { get; set; }
    
    //config mapping class <-> db
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //defaut get class name for table name but override
        modelBuilder.Entity<Provider>().ToTable("providers");
        modelBuilder.Entity<InvoiceSession>().ToTable("invoice_sessions");
        modelBuilder.Entity<RefreshToken>().ToTable("refresh_tokens");
        modelBuilder.Entity<TctAccount>().ToTable("tct_accounts");
        modelBuilder.Entity<TctSession>().ToTable("tct_sessions");
        modelBuilder.Entity<TctInvoice>().ToTable("tct_invoices");
        
        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Customer)
            .WithOne()
            .HasForeignKey<InvoiceCustomer>(c => c.InvoiceId);

        modelBuilder.Entity<Invoice>()
            .HasMany(i => i.Items)
            .WithOne()
            .HasForeignKey(item => item.InvoiceId);
    }
}