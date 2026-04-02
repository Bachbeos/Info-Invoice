namespace be_infoInvoice.Core.DTOs;

public class TctLoginRequest
{
    public string username { get; set; } = null!;
    public string password { get; set; } = null!;
}

public class TctLoginResponse
{
    public int statusCode { get; set; }
    public TctSessionData content { get; set; } = null!;
    public string message { get; set; } = null!;
}

public class TctSessionData
{
    public string session { get; set; } = null!;
}

public class TctSyncRequest
{
    public string fromDate { get; set; } = null!;
    public string toDate { get; set; } = null!;
    public int invoiceType { get; set; }
    public string session { get; set; } = null!;
}

public class TctInvoiceListResponse
{
    public int total { get; set; }
    public List<TctInvoiceDto> datas { get; set; } = new();
}

public class TctInvoiceDto
{
    public string id { get; set; } = null!;
    public string hsgoc { get; set; } = null!;
    public DateTime tdlap { get; set; }
    public string ttxly { get; set; } = null!;
    public string tthai { get; set; } = null!;
    public string nbmst { get; set; } = null!;
    public string nbten { get; set; } = null!;
    public string nbdchi { get; set; } = null!;
    public string nmmst { get; set; } = null!;
    public string nmten { get; set; } = null!;
    public string nmdchi { get; set; } = null!;
    public string khmshdon { get; set; } = null!;
    public string khhdon { get; set; } = null!;
    public string shdon { get; set; } = null!;
    public decimal tgtcthue { get; set; }
    public decimal tgtthue { get; set; }
    public decimal tgtttbso { get; set; }
    public string dvtte { get; set; } = null!;
    public string mhdon { get; set; } = null!;
}

public class TctDetailRequest
{
    public string id { get; set; } = null!;
    public string nbmst { get; set; } = null!;
    public string khmshdon { get; set; } = null!;
    public string khhdon { get; set; } = null!;
    public string shdon { get; set; } = null!;
    public string hsgoc { get; set; } = null!;
    public string ttxly { get; set; } = null!;
    public string session { get; set; } = null!;
}

public class TctXmlRequest
{
    public string id { get; set; } = null!;
    public string nbmst { get; set; } = null!;
    public string khmshdon { get; set; } = null!;
    public string khhdon { get; set; } = null!;
    public string shdon { get; set; } = null!;
    public string hsgoc { get; set; } = null!;
    public string session { get; set; } = null!;
}
