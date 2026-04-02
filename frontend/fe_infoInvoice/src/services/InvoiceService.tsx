import { apiClient } from "../lib/apiClient";
import endpoint from "../configs/urls";
import type { IProvider } from "../types/invoice";

const invoiceService = {
  getProviders: () => apiClient.get<IProvider[]>(endpoint.invoice.providers),
};

export default invoiceService;
