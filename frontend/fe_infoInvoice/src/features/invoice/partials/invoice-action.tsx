import { useInvoiceAction } from "../hooks/useInvoiceAction";
import { InvoiceInfoSection, CustomerInfoSection, ProductTable, SummarySection } from "./invoice-sections";
import type { ActionMode, IInvoiceDetail } from "../types/invoice";
import "./invoice-action.scss";

interface InvoiceProps {
    mode?: ActionMode;
    invoiceDetail?: IInvoiceDetail;
    onBack?: () => void;
}

export default function ActionInvoice({ mode: initialMode, invoiceDetail, onBack }: InvoiceProps) {
    const {
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
    } = useInvoiceAction({ initialMode, invoiceDetail, onBack });

    const { subTotal, totalVat, totalAmount } = totals;

    return (
        <div className="invoice-container container my-4">
            <div className="inv-header d-flex justify-content-between align-items-center mb-4 mt-4">
                <div className="d-flex align-items-center gap-3">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onBack}>
                        <i className="ri-arrow-left-line me-1" /> Quay lại
                    </button>
                    <h3 className="mb-0">
                        {isViewMode
                            ? "Chi Tiết Hóa Đơn"
                            : actionMode === "add"
                                ? "Thêm Mới Hóa Đơn"
                                : "Cập Nhật Hóa Đơn"
                        }
                    </h3>
                </div>
            </div>

            <fieldset disabled={isViewMode}>
                <InvoiceInfoSection 
                    data={formData} 
                    onChange={updateInvoiceInfo} 
                    isViewMode={isViewMode} 
                />
                
                <CustomerInfoSection 
                    customer={formData.customer} 
                    onChange={updateCustomerInfo} 
                    isViewMode={isViewMode} 
                />
                
                <ProductTable 
                    products={formData.items} 
                    onUpdate={updateProduct} 
                    onAdd={addRow} 
                    onRemove={removeRow} 
                    isViewMode={isViewMode} 
                />
                
                <SummarySection 
                    subTotal={subTotal} 
                    totalVat={totalVat} 
                    totalAmount={totalAmount} 
                    invDiscAmount={formData.invDiscAmount} 
                    onDiscChange={(val) => updateInvoiceInfo({ invDiscAmount: val })} 
                    isViewMode={isViewMode} 
                />
            </fieldset>

            <div className="d-flex justify-content-end gap-2 mt-4">
                {isViewMode ? (
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg px-5"
                        onClick={onBack}
                    >
                        ĐÓNG
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-lg px-5"
                            onClick={onBack}
                        >
                            HỦY
                        </button>
                        <button
                            className="btn btn-primary btn-lg px-5"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Đang xử lý..."
                                : actionMode === "add"
                                    ? "THÊM MỚI HÓA ĐƠN"
                                    : "CẬP NHẬT HÓA ĐƠN"
                            }
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}