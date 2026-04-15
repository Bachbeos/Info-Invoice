import { useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import invoiceService from "../services/invoice";
import { ApiError } from "../../../lib/apiClient";
import type { ActionMode, IActionInvoiceRequest, IInvoiceDetail, IInvoiceRequest, IProductItem } from "../types/invoice";

interface UseInvoiceActionProps {
    initialMode?: ActionMode;
    invoiceDetail?: IInvoiceDetail;
    onBack?: () => void;
}

export const useInvoiceAction = ({ initialMode, invoiceDetail, onBack }: UseInvoiceActionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [actionMode] = useState<ActionMode>(initialMode ?? "add");
    const isViewMode = actionMode === "view";

    const [formData, setFormData] = useState<IInvoiceDetail>(() => {
        if (invoiceDetail) {
            return {
                ...invoiceDetail,
                items: invoiceDetail.items.map((item, index) => ({
                    ...item,
                    id: item.id ?? index + 1,
                })),
            };
        }

        return {
            transactionId: crypto.randomUUID(),
            createdDate: new Date().toISOString().split("T")[0],
            paidTp: "TM",
            hdNo: "0",
            clsfNo: "1",
            exchCd: "VND",
            exchRt: 1,
            invoiceType: 1,
            invDiscAmount: 0,
            items: [
                {
                    id: 1,
                    itmKnd: "1",
                    qty: 1,
                    unprc: 0,
                    discRate: 0,
                    discAmt: 0,
                    vatRt: "10",
                    vatAmt: 0,
                    amt: 0,
                    totalAmt: 0,
                },
            ],
        } as IInvoiceDetail;
    });

    const updateInvoiceInfo = useCallback((updates: Partial<IInvoiceDetail>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    }, []);

    const updateCustomerInfo = useCallback((updates: Partial<IInvoiceDetail["customer"]>) => {
        setFormData((prev) => ({
            ...prev,
            customer: { ...prev.customer, ...updates },
        }));
    }, []);

    const addRow = useCallback(() => {
        setFormData((prev) => {
            const nextId = prev.items.reduce((max, item) => Math.max(max, item.id ?? 0), 0) + 1;
            const nextItem: IProductItem = {
                id: nextId,
                itmKnd: "1",
                qty: 1,
                unprc: 0,
                amt: 0,
                discRate: 0,
                discAmt: 0,
                vatRt: "10",
                vatAmt: 0,
                totalAmt: 0,
                itmCd: "",
                itmName: "",
                unitNm: ""
            };
            return { ...prev, items: [...prev.items, nextItem] };
        });
    }, []);

    const removeRow = useCallback((id?: number) => {
        if (!id) return;
        setFormData((prev) => {
            if (prev.items.length <= 1) return prev;
            return { ...prev, items: prev.items.filter((item) => item.id !== id) };
        });
    }, []);

    const updateProduct = useCallback((id: number | undefined, field: keyof IProductItem, value: any) => {
        if (id === undefined) return;

        setFormData((prev) => {
            const nextItems = prev.items.map((item) => {
                if (item.id !== id) return item;

                const nextItem = { ...item, [field]: value } as IProductItem;
                
                // Recalculate item totals if quantity, price, discount or VAT rate changes
                if (["qty", "unprc", "discAmt", "vatRt"].includes(field)) {
                    const amt = (nextItem.qty || 0) * (nextItem.unprc || 0) - (nextItem.discAmt || 0);
                    const vatRate = parseFloat(nextItem.vatRt) || 0;
                    const vatAmt = vatRate > 0 ? (amt * vatRate) / 100 : 0;

                    nextItem.amt = amt;
                    nextItem.vatAmt = vatAmt;
                    nextItem.totalAmt = amt + vatAmt;
                }

                return nextItem;
            });

            return { ...prev, items: nextItems };
        });
    }, []);

    const totals = useMemo(() => {
        const subTotal = formData.items.reduce((sum, item) => sum + ((item.qty || 0) * (item.unprc || 0) - (item.discAmt || 0)), 0);
        const totalVat = formData.items.reduce((sum, item) => sum + (item.vatAmt || 0), 0);
        const totalAmount = subTotal + totalVat - (formData.invDiscAmount || 0);
        return { subTotal, totalVat, totalAmount };
    }, [formData.items, formData.invDiscAmount]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const hdNoNumber = formData.hdNo === "" ? null : Number(formData.hdNo);
            const payload: IInvoiceRequest = {
                transactionId: formData.transactionId,
                invRef: formData.invRef,
                poNo: formData.poNo,
                invSubTotal: totals.subTotal,
                invVatRate: formData.invVatRate,
                invVatAmount: totals.totalVat,
                invDiscAmount: formData.invDiscAmount,
                invTotalAmount: totals.totalAmount,
                paidTp: formData.paidTp,
                note: formData.note,
                hdNo: hdNoNumber !== null && Number.isNaN(hdNoNumber) ? null : hdNoNumber,
                createdDate: formData.createdDate,
                clsfNo: formData.clsfNo,
                spcfNo: formData.spcfNo,
                templateCode: formData.templateCode,
                exchCd: formData.exchCd,
                exchRt: formData.exchRt,
                bankAccount: formData.bankAccount,
                bankName: formData.bankName,
                customer: formData.customer,
                products: formData.items,
            };

            let res;
            if (actionMode === "add") {
                res = await invoiceService.add(payload);
            } else {
                if (!invoiceDetail?.transactionId) {
                    toast.error("Thiếu transactionIdOld để cập nhật hóa đơn");
                    return;
                }

                const updatePayload: IActionInvoiceRequest = {
                    ...payload,
                    transactionIdOld: invoiceDetail.transactionId,
                };
                res = await invoiceService.update(updatePayload);
            }

            if (res.code === 200) {
                toast.success(res.message || "Thao tác thành công");
                onBack?.();
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Lỗi kết nối");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        actionMode,
        isViewMode,
        totals,
        updateInvoiceInfo,
        updateCustomerInfo,
        addRow,
        removeRow,
        updateProduct,
        handleSubmit,
    };
};
