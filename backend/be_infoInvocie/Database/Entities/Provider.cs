using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_infoInvoice.Database.Entities;

[Table("providers")]
public class Provider
{
    public int Id { get; set; }
    [MaxLength(255)]
    public string Name { get; set; } = null!;
}