import endpoint from "../../../configs/endpoint";
import { apiClient } from "../../../libs/apiClients";
import type {
  IActionInvoiceRequest,
  IActionInvoiceResponse,
  IInvoiceDetail,
  IInvoiceRequest,
  IInvoiceResponse,
  InvoiceListParams,
  InvoiceListResponse,
} from "../types/invoice.type";

const InvoiceService = {
  getInvoiceList: async (
    params: InvoiceListParams,
  ): Promise<InvoiceListResponse> => {
    const res = await apiClient.get<InvoiceListResponse>(
      endpoint.invoice.list,
      params,
    );
    return res;
  },

  getInvoiceDetail: async (
    id: number,
  ): Promise<{ code: number; message?: string; data: IInvoiceDetail }> => {
    const res = await apiClient.get<{
      code: number;
      message?: string;
      data: IInvoiceDetail;
    }>(`${endpoint.invoice.detail}/${id}`);
    return res;
  },

  add: (payload: IInvoiceRequest) =>
    apiClient.post<IInvoiceResponse>(endpoint.invoice.add, payload),

  update: (payload: IActionInvoiceRequest) =>
    apiClient.post<IActionInvoiceResponse>(endpoint.invoice.update, payload),

  delete: (id: number) =>
    apiClient.delete<{ code: number; message?: string }>(
      `${endpoint.invoice.delete}/${id}`,
    ),
} as const;

export default InvoiceService;
