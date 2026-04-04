
export interface IProvider {
    id: number;
    name: string;
}

export interface IInvoiceListRequest {
    page?: number;
    limit?: number;
    keyword?: string;
}

export interface IInvoiceProductResponse {
    itmName: string;
    qty: number;
    unprc: number;
    vatRt: number;
    totalAmt: number;
}

export interface IInvoiceResponse {
    id: number;
    transactionId: string;
    invoiceNo: string;
    invRef: string;
    custNm: string;
    invTotalAmount: number;
    status: boolean;
    createdAt: string;
    products: IInvoiceProductResponse[];
}

// ── Phát hành hóa đơn ────────────────────────────────────────

export interface IIssueProductItem {
    itmCd: string;
    itmName: string;
    itmKnd: number;
    unitNm: string;
    qty: number;
    unprc: number;
    amt: number;
    discRate: number;
    discAmt: number;
    vatRt: string;
    vatAmt: number;
    totalAmt: number;
}

export interface IIssueCustomer {
    custCd: string;
    custNm: string;
    custCompany: string;
    taxCode: string;
    custCity: string;
    custDistrictName: string;
    custAddrs: string;
    custPhone: string;
    custBankAccount: string;
    custBankName: string;
    email: string;
    emailCC: string;
}

export interface IIssueInvoiceRequest {
    transactionID: string;
    invRef: string;
    poNo: string;
    invSubTotal: number;
    invVatRate: string | null;
    invVatAmount: number;
    invDiscAmount: number;
    invTotalAmount: number;
    paidTp: string;
    note: string;
    hdNo: string;
    createdDate: string;
    clsfNo: string;
    spcfNo: string;
    templateCode: string;
    exchCd: string;
    exchRt: number;
    bankAccount: string;
    bankName: string;
    customer: IIssueCustomer;
    products: IIssueProductItem[];
}

export interface IIssueInvoiceResponse {
    status: boolean;
    message: string;
    data?: {
        invoiceNo: string;
        [key: string]: unknown;
    };
}