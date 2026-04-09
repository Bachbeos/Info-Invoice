import { apiClient } from "../lib/apiClient";
import endpoint from "../configs/urls";
import type { IProvider, ITaxCheckRequest, ITaxCheckResponse, IExportXmlResponse } from "../types/invoice";
import type { IActionInvoiceRequest, IActionInvoiceResponse, IIssueInvoiceRequest, IIssueInvoiceResponse } from "../types/invoice-action";


const invoiceService = {
  getProviders: () => apiClient.get<IProvider[]>(endpoint.invoice.providers),

  issue: (payload: IIssueInvoiceRequest) =>
    apiClient.post<IIssueInvoiceResponse>(endpoint.invoice.issue, payload),

  replace: (payload: IActionInvoiceRequest) =>
    apiClient.post<IActionInvoiceResponse>(endpoint.invoice.replace, payload),

  adjust: (payload: IActionInvoiceRequest) =>
    apiClient.post<IActionInvoiceResponse>(endpoint.invoice.adjust, payload),

  exportXml: (transactionId: string) =>
    apiClient.get<IExportXmlResponse>(`${endpoint.invoice.exportXml}/${transactionId}`),

  print: (transactionId: string) =>
    apiClient.get<Blob>(`${endpoint.invoice.print}/${transactionId}`, { responseType: "blob" }),

  checkTaxStatus: (payload: ITaxCheckRequest) =>
    apiClient.post<ITaxCheckResponse>(endpoint.invoice.checkTaxStatus, payload),
};

export default invoiceService;
