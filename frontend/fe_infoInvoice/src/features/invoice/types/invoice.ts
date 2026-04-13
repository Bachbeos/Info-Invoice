export interface InvoiceItem {
    id: number;
    transactionId: string;
    invRef: string;
    invTotalAmount: number;
    exchCd: string;
    createdAt: string;
    invoiceType: number;
}

export interface InvoiceListResponse {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    items: InvoiceItem[];
}

export interface InvoiceListParams {
    page: number;
    pageSize: number;
    keyword?: string;
}

export interface IApiResult<T> {
    code: number;
    message: string;
    data: T;
    timestamp?: string;
}

export interface ICustomer {
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

export interface IProductItem {
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

// ─── Phát hành ────────────────────────────────────────────────

export interface IIssueInvoiceRequest {
    transactionId: string;
    invRef: string;
    poNo: string;
    invSubTotal: number;
    invVatRate: string | null;
    invVatAmount: number;
    invDiscAmount: number;
    invTotalAmount: number;
    paidTp: string;
    note: string;
    hdNo: number | null;
    createdDate: string;
    clsfNo: string;
    spcfNo: string;
    templateCode: string;
    exchCd: string;
    exchRt: number;
    bankAccount: string;
    bankName: string;
    customer: ICustomer;
    products: IProductItem[];
}

export interface IIssueInvoiceData {
    invoiceNo: string;
    invDate: string;
    transactionId: string;
    macqt: string;
}

export type IIssueInvoiceResponse = IApiResult<IIssueInvoiceData>;

// ─── Thay thế / Điều chỉnh ────────────────────────────────────

export interface IActionInvoiceRequest extends IIssueInvoiceRequest {
    transactionIdOld: string;
}

export type IActionInvoiceResponse = IApiResult<boolean>;

// ─── Chi tiết hóa đơn ────────────────

export interface IInvoiceDetailCustomer {
    custCd?: string;
    custNm?: string;
    custCompany?: string;
    taxCode?: string;
    custCity?: string;
    custDistrictName?: string;
    custAddrs?: string;
    custPhone?: string;
    custBankAccount?: string;
    custBankName?: string;
    email?: string;
    emailCC?: string;
}

export interface IInvoiceDetailProduct {
    itmCd?: string;
    itmName?: string;
    itmKnd?: number;
    unitNm?: string;
    qty?: number;
    unprc?: number;
    amt?: number;
    discRate?: number;
    discAmt?: number;
    vatRt?: string;
    vatAmt?: number;
    totalAmt?: number;
}

export interface IInvoiceDetail {
    id: number;
    transactionId?: string;
    transactionID?: string;
    invoiceNo?: string;
    invRef?: string;
    poNo?: string;
    paidTp?: string;
    clsfNo?: string;
    spcfNo?: string;
    templateCode?: string;
    hdNo?: number | null;
    createdDate?: string;
    exchCd?: string;
    exchRt?: number;
    bankAccount?: string;
    bankName?: string;
    invDiscAmount?: number;
    invVatRate?: string | null;
    invSubTotal?: number;
    invVatAmount?: number;
    invTotalAmount?: number;
    note?: string;
    customer?: IInvoiceDetailCustomer;
    products?: IInvoiceDetailProduct[];
}

export type IInvoiceDetailResponse = IApiResult<IInvoiceDetail>;

export type ActionMode = "issue" | "replace" | "adjust";
