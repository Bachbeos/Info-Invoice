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

export interface IInvoiceDetailCustomerApi {
    custCd?: string;
    custNm?: string;
    custCompany?: string;
    taxCode?: string;
    custCity?: string;
    custDistrict?: string;
    custAddrs?: string;
    custPhone?: string;
    custBankAccount?: string;
    custBankName?: string;
    email?: string;
    emailCc?: string;
}

export interface IInvoiceDetailProductApi {
    id?: number;
    itmCd?: string;
    itmName?: string;
    itmKnd?: number | string;
    unitNm?: string;
    qty?: number;
    unprc?: number;
    amt?: number;
    discRate?: number;
    discAmt?: number;
    vatRt?: string | number;
    vatAmt?: number;
    totalAmt?: number;
}

export interface IInvoiceDetailApi {
    id: number;
    userId?: number;
    taxId?: number;
    transactionId?: string;
    transactionID?: string;
    invRef?: string;
    poNo?: string;
    invSubTotal?: number;
    invVatRate?: string | null;
    invDiscAmount?: number;
    invVatAmount?: number;
    invTotalAmount?: number;
    exchCd?: string;
    exchRt?: number;
    paidTp?: string;
    note?: string;
    hdNo?: number | string | null;
    createdDate?: string;
    clsfNo?: string;
    spcfNo?: string;
    templateCode?: string;
    bankAccount?: string;
    bankName?: string;
    status?: boolean;
    invoiceType?: number;
    noteDesc?: string | null;
    invoiceNo?: string;
    customer?: IInvoiceDetailCustomerApi;
    items?: IInvoiceDetailProductApi[];
    products?: IInvoiceDetailProductApi[];
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

export const normalizeInvoiceDetail = (detail: IInvoiceDetailApi): IInvoiceDetail => {
    const rawProducts = detail.items ?? detail.products ?? [];
    const normalizedHdNo = typeof detail.hdNo === "string" ? Number(detail.hdNo) : detail.hdNo;

    return {
        id: detail.id,
        transactionId: detail.transactionId ?? detail.transactionID,
        transactionID: detail.transactionID ?? detail.transactionId,
        invoiceNo: detail.invoiceNo ?? (detail.hdNo != null ? String(detail.hdNo) : undefined),
        invRef: detail.invRef,
        poNo: detail.poNo,
        paidTp: detail.paidTp,
        clsfNo: detail.clsfNo,
        spcfNo: detail.spcfNo,
        templateCode: detail.templateCode,
        hdNo: Number.isFinite(normalizedHdNo as number) ? (normalizedHdNo as number) : null,
        createdDate: detail.createdDate,
        exchCd: detail.exchCd,
        exchRt: detail.exchRt,
        bankAccount: detail.bankAccount,
        bankName: detail.bankName,
        invDiscAmount: detail.invDiscAmount,
        invVatRate: detail.invVatRate,
        invSubTotal: detail.invSubTotal,
        invVatAmount: detail.invVatAmount,
        invTotalAmount: detail.invTotalAmount,
        note: detail.note,
        customer: detail.customer
            ? {
                custCd: detail.customer.custCd,
                custNm: detail.customer.custNm,
                custCompany: detail.customer.custCompany,
                taxCode: detail.customer.taxCode,
                custCity: detail.customer.custCity,
                custDistrictName: detail.customer.custDistrict,
                custAddrs: detail.customer.custAddrs,
                custPhone: detail.customer.custPhone,
                custBankAccount: detail.customer.custBankAccount,
                custBankName: detail.customer.custBankName,
                email: detail.customer.email,
                emailCC: detail.customer.emailCc,
            }
            : undefined,
        products: rawProducts.map((product) => ({
            id: product.id,
            itmCd: product.itmCd,
            itmName: product.itmName,
            itmKnd: typeof product.itmKnd === "string" ? Number(product.itmKnd) : product.itmKnd,
            unitNm: product.unitNm,
            qty: product.qty,
            unprc: product.unprc,
            amt: product.amt,
            discRate: product.discRate,
            discAmt: product.discAmt,
            vatRt: product.vatRt != null ? String(product.vatRt) : undefined,
            vatAmt: product.vatAmt,
            totalAmt: product.totalAmt,
        })),
    };
};

export type IInvoiceDetailApiResponse = IApiResult<IInvoiceDetailApi>;

export type IInvoiceDetailResponse = IApiResult<IInvoiceDetail>;

export type ActionMode = "issue" | "replace" | "adjust" | "view";
