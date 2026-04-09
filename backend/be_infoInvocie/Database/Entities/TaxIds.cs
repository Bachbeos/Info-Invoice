using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities
{
    [Table("tax_ids")]
    public class TaxIds
    {
        public int Id { get; set; }
        [Column("ma_dvcs")]
        public required string MaDvcs { get; set; }
        [Column("company_name")]
        public string? CompanyName { get; set; }
        public string? Address { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
