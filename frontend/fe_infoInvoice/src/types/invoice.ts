
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

export interface IIssueInvoiceData {
    invoiceNo: string;
    invDate: string;
    transactionId: string;
    macqt: string;
}

export interface IIssueInvoiceResponse {
    code: number;
    status: number; // 1 = thành công, 0 = thất bại
    message: string;
    data: IIssueInvoiceData | null;
}

export interface IActionInvoiceRequest extends IIssueInvoiceRequest {
    transactionIdOld: string;
}

export interface IActionInvoiceResponse {
    message: string;
}

export interface ITaxCheckRequest {
    taxCodes: string[];
}

export interface ITaxStatusResult {
    maSoThue: string;
    masothueId: string;
    tenCty: string;
    diaChi: string;
    tthai: string;
    trangThaiHoatDong: string;
    lastUpdate: string;
    ngayKiemTra: string;
}

export interface ITaxCheckResponse {
    status: boolean;
    message: string;
    datas: ITaxStatusResult[];
}

export interface IExportXmlResponse {
    status: boolean;
    message: string;
    data: string;
}