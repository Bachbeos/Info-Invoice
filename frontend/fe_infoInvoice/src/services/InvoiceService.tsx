import { apiClient } from "../lib/apiClient";
import endpoint from "../configs/urls";
import type { IProvider, IIssueInvoiceRequest, IIssueInvoiceResponse } from "../types/invoice";

const invoiceService = {
  getProviders: () => apiClient.get<IProvider[]>(endpoint.invoice.providers),

  issue: (payload: IIssueInvoiceRequest) =>
    apiClient.post<IIssueInvoiceResponse>(endpoint.invoice.issue, payload),
};

export default invoiceService;
