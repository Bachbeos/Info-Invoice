export type ActionMode = "add" | "update" | "delete" | "view";

export interface InvoiceItem {
  id: number;
  transactionId: string;
  invRef: string;
  invTotalAmount: number;
  exchCd: string;
  createdAt: string;
  invoiceType: number;
}

export interface InvoiceListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

export interface InvoiceListData {
  items: InvoiceItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type InvoiceListResponse = IApiResult<InvoiceListData>;
export interface ICustomer {
  id?: number;
  custCd: string;
  custNm: string;
  custCompany: string;
  taxCode: string;
  custCity: string;
  custDistrict: string;
  custAddrs: string;
  custPhone: string;
  custBankAccount: string;
  custBankName: string;
  email: string;
  emailCc: string;
}

export interface IProductItem {
  id?: number;
  itmCd: string;
  itmName: string;
  itmKnd: string;
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

export interface IInvoiceDetail {
  id: number;
  transactionId: string;
  invRef: string;
  poNo: string;
  invSubTotal: number;
  invVatRate: string | null;
  invVatAmount: number;
  invTotalAmount: number;
  invDiscAmount: number;
  exchCd: string;
  exchRt: number;
  paidTp: string;
  note: string;
  hdNo: string;
  clsfNo: string;
  spcfNo: string;
  templateCode: string;
  bankAccount: string;
  bankName: string;
  createdDate: string;
  invoiceType: number;
  customer: ICustomer;
  items: IProductItem[];
}

export interface IApiResult<T> {
  code: number;
  message: string;
  data: T;
  timestamp?: string;
}

export interface IInvoiceRequest {
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

export interface IInvoiceData {
  invoiceNo: string;
  invDate: string;
  transactionId: string;
  macqt: string;
}

export type IInvoiceResponse = IApiResult<IInvoiceData>;

export interface IActionInvoiceRequest extends IInvoiceRequest {
  transactionIdOld: string;
}

export type IActionInvoiceResponse = IApiResult<boolean>;
