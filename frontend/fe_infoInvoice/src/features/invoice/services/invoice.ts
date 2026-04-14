import { apiClient } from "../../../lib/apiClient";
import endpoint from "../../../configs/urls";
import { normalizeInvoiceDetail } from "../types/invoice";
import type { IActionInvoiceRequest, IActionInvoiceResponse, IInvoiceDetailApiResponse, IInvoiceDetailResponse, IIssueInvoiceRequest, IIssueInvoiceResponse, InvoiceListResponse } from "../types/invoice";

export interface InvoiceListParams {
    page: number;
    pageSize: number;
    keyword?: string;
}

type InvoiceListApiResponse =
    | InvoiceListResponse
    | {
        code?: number;
        message?: string;
        data?: InvoiceListResponse;
    };

const normalizeInvoiceList = (response: InvoiceListApiResponse): InvoiceListResponse => {
    if ("data" in response && response.data) {
        return response.data;
    }
    return response as InvoiceListResponse;
};

const InvoiceService = {
    getInvoiceList: async (params: InvoiceListParams): Promise<InvoiceListResponse> => {
        const res = await apiClient.get<InvoiceListApiResponse>(endpoint.invoice.list, params);
        return normalizeInvoiceList(res);
    },
    getInvoiceDetail: async (id: number): Promise<IInvoiceDetailResponse> => {
        const res = await apiClient.get<IInvoiceDetailApiResponse>(`${endpoint.invoice.detail}/${id}`);
        return {
            ...res,
            data: normalizeInvoiceDetail(res.data),
        };
    },

    issue: (payload: IIssueInvoiceRequest) =>
        apiClient.post<IIssueInvoiceResponse>(endpoint.invoice.public, payload),

    replace: (payload: IActionInvoiceRequest) =>
        apiClient.post<IActionInvoiceResponse>(endpoint.invoice.replace, payload),

    adjust: (payload: IActionInvoiceRequest) =>
        apiClient.post<IActionInvoiceResponse>(endpoint.invoice.adjust, payload),

    delete: (id: number) =>
        apiClient.delete<IActionInvoiceResponse>(`${endpoint.invoice.delete}/${id}`),
} as const;


export default InvoiceService;
