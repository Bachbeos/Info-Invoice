using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities
{
    [Table("users")]
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        [Column("full_name")]
        public string? Fullname { get; set; }
        public string? Email { get; set; }
        public int Status { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
