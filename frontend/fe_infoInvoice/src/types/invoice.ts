
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