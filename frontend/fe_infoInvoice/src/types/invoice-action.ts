export interface IApiResult<T> {
    isSuccess: boolean;
    code: number;
    message: string;
    data: T;
    timestamp: string;
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
    customer: IIssueCustomer;
    products: IIssueProductItem[];
}

export interface IActionInvoiceRequest extends IIssueInvoiceRequest {
    transactionIdOld: string;
}

export interface IIssueInvoiceData {
    invoiceNo: string;
    invDate: string;
    transactionId: string;
    macqt: string;
}

export type IIssueInvoiceResponse = IApiResult<IIssueInvoiceData>;
export type IActionInvoiceResponse = IApiResult<boolean>;