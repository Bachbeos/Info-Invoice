import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import invoiceService from "../../services/InvoiceService";
import { ApiError } from "../../lib/apiClient";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../../utils/token";
import "./publicInvoice.scss";
import type {
  IReplaceAdjustInvoiceListData,
  IReplaceAdjustInvoiceListItem,
  ITaxStatusResult,
} from "../../types/invoice";

interface InvoiceOption {
  id: number;
  transactionId: string;
  label: string;
}

const getTransactionId = (invoice: IReplaceAdjustInvoiceListItem): string =>
  invoice.transactionId ?? invoice.transactionID ?? "";

const getInvoiceListItems = (
  data: IReplaceAdjustInvoiceListData | null | undefined,
): IReplaceAdjustInvoiceListItem[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.records)) return data.records;
  if (Array.isArray(data.datas)) return data.datas;
  return [];
};

const toInvoiceOption = (invoice: IReplaceAdjustInvoiceListItem): InvoiceOption => {
  const transactionId = getTransactionId(invoice);
  const invoiceNo = invoice.invoiceNo ? `HĐ ${invoice.invoiceNo}` : `ID ${invoice.id}`;
  const createdAt = invoice.createdDate ?? invoice.createdAt;
  const dateText = createdAt ? ` - ${new Date(createdAt).toLocaleDateString("vi-VN")}` : "";
  return {
    id: invoice.id,
    transactionId,
    label: `${invoiceNo} - ${transactionId || "(Không có Transaction ID)"}${dateText}`,
  };
};

interface ProductItem {
  id: string;
  itmCd: string;
  itmName: string;
  itmKnd: number;
  unitNm: string;
  qty: number;
  unprc: number;
  discRate: number;
  discAmt: number;
  vatRt: string;
}

export default function PublicInvoice() {
  const navigate = useNavigate();
  const [transactionID] = useState(crypto.randomUUID());
  const [actionMode, setActionMode] = useState<"issue" | "replace" | "adjust">(
    "issue",
  );
  const [transactionIdOld, setTransactionIdOld] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [invoiceOptions, setInvoiceOptions] = useState<InvoiceOption[]>([]);
  const [isInvoiceListLoading, setIsInvoiceListLoading] = useState(false);
  const [isInvoiceDetailLoading, setIsInvoiceDetailLoading] = useState(false);

  const [invoiceInfo, setInvoiceInfo] = useState({
    invRef: "",
    poNo: "",
    paidTp: "TM",
    clsfNo: "1",
    spcfNo: "",
    templateCode: "",
    hdNo: "",
    createdDate: new Date().toISOString().split("T")[0],
    exchCd: "VND",
    exchRt: 1,
    bankAccount: "",
    bankName: "",
    invDiscAmount: 0,
    note: "",
    invVatRate: "",
  });

  const [customer, setCustomer] = useState({
    custCd: "",
    custNm: "",
    custCompany: "",
    taxCode: "",
    custCity: "",
    custDistrictName: "",
    custAddrs: "",
    custPhone: "",
    custBankAccount: "",
    custBankName: "",
    email: "",
    emailCC: "",
  });

  const [products, setProducts] = useState<ProductItem[]>(() => [
    {
      id: Date.now().toString(),
      itmCd: "",
      itmName: "",
      itmKnd: 1,
      unitNm: "",
      qty: 1,
      unprc: 0,
      discRate: 0,
      discAmt: 0,
      vatRt: "10",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const [utilTransactionId, setUtilTransactionId] = useState("");
  const [taxCodesInput, setTaxCodesInput] = useState("");
  const [taxResults, setTaxResults] = useState<ITaxStatusResult[]>([]);
  const [isUtilLoading, setIsUtilLoading] = useState(false);

  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (actionMode === "issue") {
      setSelectedInvoiceId("");
      setInvoiceOptions([]);
      setTransactionIdOld("");
      return;
    }

    const fetchInvoiceOptions = async () => {
      setIsInvoiceListLoading(true);
      setSelectedInvoiceId("");
      setTransactionIdOld("");
      try {
        const res = await invoiceService.getInvoicesList({ page: 1, pageSize: 100 });
        if (res.code !== 200) {
          toast.error(res.message || "Không tải được danh sách hóa đơn");
          setInvoiceOptions([]);
          return;
        }

        const options = getInvoiceListItems(res.data).map(toInvoiceOption);
        setInvoiceOptions(options);
      } catch (err) {
        if (err instanceof ApiError) {
          toast.error(`Không tải được danh sách hóa đơn (${err.status})`);
        } else {
          toast.error("Không tải được danh sách hóa đơn");
        }
        setInvoiceOptions([]);
      } finally {
        setIsInvoiceListLoading(false);
      }
    };

    void fetchInvoiceOptions();
  }, [actionMode]);

  const handleSelectOldInvoice = async (invoiceIdValue: string) => {
    setSelectedInvoiceId(invoiceIdValue);
    setTransactionIdOld("");

    if (!invoiceIdValue) return;

    const invoiceId = Number(invoiceIdValue);
    setIsInvoiceDetailLoading(true);
    try {
      const res = await invoiceService.getInvoiceDetail(invoiceId);
      if (res.code !== 200) {
        toast.error(res.message || "Không lấy được chi tiết hóa đơn");
        return;
      }

      const transactionId = res.data?.transactionId ?? res.data?.transactionID;
      if (transactionId) {
        setTransactionIdOld(transactionId);
        return;
      }

      const fallbackTransactionId =
        invoiceOptions.find((option) => option.id === invoiceId)?.transactionId ?? "";
      if (fallbackTransactionId) {
        setTransactionIdOld(fallbackTransactionId);
      } else {
        toast.error("Không tìm thấy Transaction ID của hóa đơn đã chọn");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(`Không lấy được chi tiết hóa đơn (${err.status})`);
      } else {
        toast.error("Không lấy được chi tiết hóa đơn");
      }
    } finally {
      setIsInvoiceDetailLoading(false);
    }
  };

  const handleExportXml = async () => {
    if (!utilTransactionId) return toast.warn("Vui lòng nhập Transaction ID");
    setIsUtilLoading(true);
    try {
      const resp = await invoiceService.exportXml(utilTransactionId);
      if (resp.status) {
        const byteCharacters = atob(resp.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/xml" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${utilTransactionId}.xml`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        toast.error(resp.message || "Export thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi tải XML");
    } finally {
      setIsUtilLoading(false);
    }
  };

  const handlePrintPdf = async () => {
    if (!utilTransactionId) return toast.warn("Vui lòng nhập Transaction ID");
    setIsUtilLoading(true);
    try {
      const resp = await invoiceService.print(utilTransactionId);
      const url = window.URL.createObjectURL(new Blob([resp as any]));
      window.open(url, "_blank");
    } catch (err) {
      toast.error("Lỗi khi tải PDF");
    } finally {
      setIsUtilLoading(false);
    }
  };

  const handleCheckTax = async () => {
    if (!taxCodesInput) return toast.warn("Vui lòng nhập MST");
    const arr = taxCodesInput
      .split(/[\n,]+/)
      .map((x) => x.trim())
      .filter(Boolean);
    if (!arr.length) return;
    setIsUtilLoading(true);
    try {
      const resp = await invoiceService.checkTaxStatus({ taxCodes: arr });
      if (resp.status) {
        setTaxResults(resp.datas || []);
        toast.success(resp.message || "Kiểm tra MST thành công");
      } else {
        toast.error((resp as any).message || "Kiểm tra MST thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi check MST");
    } finally {
      setIsUtilLoading(false);
    }
  };

  const calculateSummary = () => {
    let subTotal = 0;
    let totalVat = 0;
    products.forEach((p) => {
      const amt = p.qty * p.unprc - p.discAmt;
      subTotal += amt;
      const vatRtNum = parseFloat(p.vatRt);
      if (vatRtNum > 0) totalVat += amt * (vatRtNum / 100);
    });
    const totalAmount = subTotal + totalVat - invoiceInfo.invDiscAmount;
    return { subTotal, totalVat, totalAmount };
  };

  const { subTotal, totalVat, totalAmount } = calculateSummary();

  const addRow = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        itmCd: "",
        itmName: "",
        itmKnd: 1,
        unitNm: "Cái",
        qty: 1,
        unprc: 0,
        discRate: 0,
        discAmt: 0,
        vatRt: "10",
      },
    ]);
  };

  const removeRow = (id: string) => {
    if (products.length > 1) setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof ProductItem, value: any) => {
    setProducts(
      products.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        if (field === "discRate") {
          const amt = updated.qty * updated.unprc;
          updated.discAmt = Math.round((amt * value) / 100);
        }
        if (field === "discAmt") {
          const amt = updated.qty * updated.unprc;
          updated.discRate =
            amt > 0 ? parseFloat(((value / amt) * 100).toFixed(2)) : 0;
        }
        return updated;
      }),
    );
  };

  const handleSubmit = async () => {
    const finalProducts = products.map((p) => {
      const amt = p.qty * p.unprc - p.discAmt;
      const vatRtNum = parseFloat(p.vatRt);
      const vatAmt = vatRtNum <= 0 ? 0 : amt * (vatRtNum / 100);
      return {
        itmCd: p.itmCd || `PROD-${p.id.slice(-4)}`,
        itmName: p.itmName,
        itmKnd: p.itmKnd,
        unitNm: p.unitNm,
        qty: p.qty,
        unprc: p.unprc,
        amt,
        discRate: p.discRate,
        discAmt: p.discAmt,
        vatRt: p.vatRt,
        vatAmt: parseFloat(vatAmt.toFixed(0)),
        totalAmt: parseFloat((amt + vatAmt).toFixed(0)),
      };
    });

    const basePayload = {
      invRef: invoiceInfo.invRef,
      poNo: invoiceInfo.poNo,
      invSubTotal: subTotal,
      invVatRate: invoiceInfo.invVatRate || null,
      invVatAmount: totalVat,
      invDiscAmount: invoiceInfo.invDiscAmount,
      invTotalAmount: totalAmount,
      paidTp: invoiceInfo.paidTp,
      note: invoiceInfo.note,
      hdNo: invoiceInfo.hdNo,
      createdDate: invoiceInfo.createdDate,
      clsfNo: invoiceInfo.clsfNo,
      spcfNo: invoiceInfo.spcfNo,
      templateCode: invoiceInfo.templateCode,
      exchCd: invoiceInfo.exchCd,
      exchRt: invoiceInfo.exchRt,
      bankAccount: invoiceInfo.bankAccount,
      bankName: invoiceInfo.bankName,
      customer,
      products: finalProducts,
    };

    setIsLoading(true);

    try {
      if (actionMode === "issue") {
        const payload = { ...basePayload, transactionId: transactionID, hdNo: invoiceInfo.hdNo ? Number(invoiceInfo.hdNo) : null };

        const res = await invoiceService.issue(payload);

        if (res.code === 200) {
          toast.success(
            `Phát hành thành công! Số HĐ: ${res.data?.invoiceNo || "(chờ cấp)"} — Ngày: ${res.data?.invDate || ""}`
          );
        } else {
          toast.error(`Lỗi ${res.code}: ${res.message}`);
        }

      } else if (actionMode === "replace" || actionMode === "adjust") {
        if (!transactionIdOld) {
          toast.error("Vui lòng chọn hóa đơn gốc!");
          setIsLoading(false);
          return;
        }

        const payload = {
          ...basePayload,
          transactionId: transactionID,
          hdNo: invoiceInfo.hdNo ? Number(invoiceInfo.hdNo) : null,
          transactionIdOld
        };

        const res = actionMode === "replace"
          ? await invoiceService.replace(payload)
          : await invoiceService.adjust(payload);

        if (res.code === 200) {
          toast.success(res.message || `${actionMode === "replace" ? "Thay thế" : "Điều chỉnh"} hóa đơn thành công!`);
        } else {
          toast.error(`Lỗi ${res.code}: ${res.message}`);
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(`Lỗi hệ thống (${err.status}): ${err.message}`);
      } else {
        console.error("Submit Error:", err);
        toast.error("Không thể kết nối tới server. Vui lòng kiểm tra lại đường truyền.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString("vi-VN");

  return (
    <div className="invoice-container container my-4">
      {/* Header */}
      <div className="inv-header d-flex justify-content-between align-items-center mb-4 mt-4">
        <div>
          <h3 className="mb-0">
            <span className="brand-text">DAEWOO</span>
            <span className="separator">|</span>
            {actionMode === "issue" && "Phát hành Hóa đơn Điện tử"}
            {actionMode === "replace" && "Thay thế Hóa đơn"}
            {actionMode === "adjust" && "Điều chỉnh Hóa đơn"}
          </h3>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="btn-group shadow-sm" role="group">
            <input
              type="radio"
              className="btn-check"
              name="actionMode"
              id="btnradio1"
              autoComplete="off"
              checked={actionMode === "issue"}
              onChange={() => setActionMode("issue")}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio1">
              Phát hành
            </label>

            <input
              type="radio"
              className="btn-check"
              name="actionMode"
              id="btnradio2"
              autoComplete="off"
              checked={actionMode === "replace"}
              onChange={() => setActionMode("replace")}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio2">
              Thay thế
            </label>

            <input
              type="radio"
              className="btn-check"
              name="actionMode"
              id="btnradio3"
              autoComplete="off"
              checked={actionMode === "adjust"}
              onChange={() => setActionMode("adjust")}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio3">
              Điều chỉnh
            </label>
          </div>
          <span className="badge status-badge">● LIVE</span>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm fw-semibold btn-logout"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {(actionMode === "replace" || actionMode === "adjust") && (
        <div className="alert alert-warning mb-4 d-flex align-items-center gap-3 shadow-sm">
          <i className="ri-error-warning-line fs-4"></i>
          <div className="flex-grow-1">
            <label className="form-label fw-bold mb-1">
              Chọn hóa đơn gốc cần thay thế/điều chỉnh
            </label>
            <select
              className="form-select"
              value={selectedInvoiceId}
              onChange={(e) => void handleSelectOldInvoice(e.target.value)}
              disabled={isInvoiceListLoading || isInvoiceDetailLoading}
            >
              <option value="">
                {isInvoiceListLoading
                  ? "Đang tải danh sách hóa đơn..."
                  : "-- Chọn hóa đơn --"}
              </option>
              {invoiceOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <small className="text-muted d-block mt-2">
              {isInvoiceDetailLoading
                ? "Đang tải Transaction ID từ hóa đơn đã chọn..."
                : transactionIdOld
                  ? `Transaction ID gốc: ${transactionIdOld}`
                  : "Transaction ID gốc sẽ tự động lấy sau khi chọn hóa đơn."}
            </small>
          </div>
        </div>
      )}

      {/*Thông tin Hóa đơn */}
      <div className="card inv-card mb-4">
        <div className="card-header inv-card-header">
          <span>
            <i className="ri-file-text-line me-2" />
            Thông tin Hóa đơn
          </span>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small">
                Mã đơn hàng / Số chứng từ
              </label>
              <input
                className="form-control"
                placeholder="Nhập mã đơn hàng/số chứng từ"
                value={invoiceInfo.invRef}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, invRef: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Số đơn hàng</label>
              <input
                className="form-control"
                placeholder="Nhập số đơn hàng"
                value={invoiceInfo.poNo}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, poNo: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Ngày phát hành</label>
              <input
                type="date"
                className="form-control"
                value={invoiceInfo.createdDate}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, createdDate: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">
                Phương thức thanh toán
              </label>
              <select
                className="form-select"
                required
                value={invoiceInfo.paidTp}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, paidTp: e.target.value })
                }
              >
                <option value="TM">Tiền mặt</option>
                <option value="CK">Chuyển khoản</option>
                <option value="TM/CK">Tiền mặt/Chuyển khoản</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Số hóa đơn</label>
              <input
                className="form-control"
                placeholder="Nhập số hóa đơn"
                value={invoiceInfo.hdNo}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, hdNo: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">
                Mẫu số hóa đơn
              </label>
              <input
                className="form-control"
                required
                placeholder="Nhập mẫu số hóa đơn"
                value={invoiceInfo.clsfNo}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, clsfNo: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">
                Ký hiệu hóa đơn
              </label>
              <input
                className="form-control"
                required
                placeholder="Nhập ký hiệu hóa đơn"
                value={invoiceInfo.spcfNo}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, spcfNo: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Ký hiệu mẫu hóa đơn</label>
              <input
                className="form-control"
                placeholder="Chỉ dùng SInvoice"
                value={invoiceInfo.templateCode}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, templateCode: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">
                Thuế suất trên hóa đơn
              </label>
              <select
                className="form-select"
                value={invoiceInfo.invVatRate}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, invVatRate: e.target.value })
                }
              >
                <option value="">Nhiều thuế suất</option>
                <option value="0">0%</option>
                <option value="8">8%</option>
                <option value="10">10%</option>
                <option value="-1">Không chịu thuế</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Loại tiền</label>
              <input
                className="form-control"
                value={invoiceInfo.exchCd}
                readOnly
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Tỷ giá</label>
              <input
                type="number"
                className="form-control"
                value={invoiceInfo.exchRt}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, exchRt: +e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Tài khoản ngân hàng bên bán</label>
              <input
                className="form-control"
                placeholder="Nhập số tài khoản"
                value={invoiceInfo.bankAccount}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, bankAccount: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Ngân hàng bên bán</label>
              <input
                className="form-control"
                placeholder="Nhập tên ngân hàng"
                value={invoiceInfo.bankName}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, bankName: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Ghi chú</label>
              <input
                className="form-control"
                placeholder="Nhập ghi chú"
                value={invoiceInfo.note}
                onChange={(e) =>
                  setInvoiceInfo({ ...invoiceInfo, note: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin Khách hàng */}
      <div className="card inv-card mb-4">
        <div className="card-header inv-card-header">
          <span>
            <i className="ri-user-3-line me-2" />
            Thông tin Người mua
          </span>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small">Mã khách hàng</label>
              <input
                className="form-control"
                placeholder="Nhập mã khách hàng"
                required
                value={customer.custCd}
                onChange={(e) =>
                  setCustomer({ ...customer, custCd: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Tên khách hàng</label>
              <input
                className="form-control"
                placeholder="Nhập tên khách hàng"
                required
                value={customer.custNm}
                onChange={(e) =>
                  setCustomer({ ...customer, custNm: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Tên công ty</label>
              <input
                className="form-control"
                placeholder="Nhập tên công ty"
                value={customer.custCompany}
                onChange={(e) =>
                  setCustomer({ ...customer, custCompany: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Mã số thuế</label>
              <input
                className="form-control"
                placeholder="Nhập mã số thuế"
                required
                value={customer.taxCode}
                onChange={(e) =>
                  setCustomer({ ...customer, taxCode: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Số điện thoại</label>
              <input
                className="form-control"
                placeholder="Nhập số điện thoại"
                required
                value={customer.custPhone}
                onChange={(e) =>
                  setCustomer({ ...customer, custPhone: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Email nhận hóa đơn</label>
              <input
                type="email"
                className="form-control"
                placeholder="Nhập địa chỉ email"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Email nhận bản sao</label>
              <input
                type="email"
                className="form-control"
                placeholder="Nhập địa chỉ email"
                value={customer.emailCC}
                onChange={(e) =>
                  setCustomer({ ...customer, emailCC: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Thành phố / Tỉnh</label>
              <input
                className="form-control"
                placeholder="Nhập thành phố / tỉnh"
                value={customer.custCity}
                onChange={(e) =>
                  setCustomer({ ...customer, custCity: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Quận / Huyện</label>
              <input
                className="form-control"
                placeholder="Nhập quận / huyện"
                value={customer.custDistrictName}
                onChange={(e) =>
                  setCustomer({ ...customer, custDistrictName: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Địa chỉ</label>
              <input
                className="form-control"
                placeholder="Nhập địa chỉ"
                value={customer.custAddrs}
                onChange={(e) =>
                  setCustomer({ ...customer, custAddrs: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Tài khoản ngân hàng bên mua</label>
              <input
                className="form-control"
                placeholder="Nhập tài khoản ngân hàng"
                value={customer.custBankAccount}
                onChange={(e) =>
                  setCustomer({ ...customer, custBankAccount: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small">Ngân hàng bên mua</label>
              <input
                className="form-control"
                placeholder="Nhập tên ngân hàng"
                value={customer.custBankName}
                onChange={(e) =>
                  setCustomer({ ...customer, custBankName: e.target.value })
                }
              />
            </div>
          </div>

        </div>
      </div>

      {/* III. Chi tiết Sản phẩm */}
      <div className="card inv-card mb-4">
        <div className="card-header inv-card-header d-flex justify-content-between align-items-center">
          <span>
            <i className="ri-list-check me-2" />
            Chi tiết Sản phẩm / Dịch vụ
          </span>
          <button className="btn btn-sm btn-add-row" onClick={addRow}>
            <i className="ri-add-line me-1" />
            Thêm dòng
          </button>
        </div>
        <div className="p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 inv-table">
              <thead>
                <tr className="small text-center">
                  <th style={{ width: "4%" }}>STT</th>
                  <th style={{ width: "8%" }}>Mã hàng</th>
                  <th style={{ width: "22%" }}>Tên hàng / Dịch vụ</th>
                  <th style={{ width: "7%" }}>Loại</th>
                  <th style={{ width: "6%" }}>Đơn vị tính</th>
                  <th style={{ width: "7%" }}>Số lượng</th>
                  <th style={{ width: "12%" }}>Đơn giá</th>
                  <th style={{ width: "10%" }}>Thành tiền</th>
                  <th style={{ width: "7%" }}>Tỉ lệ chiết khấu (%)</th>
                  <th style={{ width: "9%" }}>Tiền chiết khấu</th>
                  <th style={{ width: "7%" }}>Thuế</th>
                  <th style={{ width: "9%" }}>Tiền thuế</th>
                  <th style={{ width: "4%" }}></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => {
                  const amt = p.qty * p.unprc - p.discAmt;
                  const vatRtNum = parseFloat(p.vatRt);
                  const vatAmt = vatRtNum <= 0 ? 0 : amt * (vatRtNum / 100);
                  return (
                    <tr key={p.id} className="align-middle text-center">
                      <td className="text-muted small">{idx + 1}</td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={p.itmCd}
                          onChange={(e) =>
                            updateProduct(p.id, "itmCd", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={p.itmName}
                          onChange={(e) =>
                            updateProduct(p.id, "itmName", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={p.itmKnd}
                          onChange={(e) =>
                            updateProduct(p.id, "itmKnd", +e.target.value)
                          }
                        >
                          <option value={1}>Hàng hóa/Dịch vụ</option>
                          <option value={2}>Khuyến mãi</option>
                          <option value={3}>Chiết khấu</option>
                          <option value={4}>Ghi chú</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={p.unitNm}
                          onChange={(e) =>
                            updateProduct(p.id, "unitNm", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={p.qty}
                          onChange={(e) =>
                            updateProduct(p.id, "qty", +e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={p.unprc}
                          onChange={(e) =>
                            updateProduct(p.id, "unprc", +e.target.value)
                          }
                        />
                      </td>
                      <td className="cell-readonly">{fmt(p.qty * p.unprc)}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={p.discRate}
                          onChange={(e) =>
                            updateProduct(p.id, "discRate", +e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={p.discAmt}
                          onChange={(e) =>
                            updateProduct(p.id, "discAmt", +e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={p.vatRt}
                          onChange={(e) =>
                            updateProduct(p.id, "vatRt", e.target.value)
                          }
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="8">8%</option>
                          <option value="10">10%</option>
                          <option value="-1">KCT</option>
                        </select>
                      </td>
                      <td className="cell-readonly text-primary">
                        {fmt(vatAmt)}
                      </td>
                      <td>
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => removeRow(p.id)}
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* IV. Tổng kết */}
      <div className="card inv-card mb-4">
        <div className="card-header inv-card-header">
          <i className="ri-calculator-line me-2" />
          Tổng kết
        </div>
        <div className="card-body">
          <div className="row g-3 justify-content-end">
            <div className="col-md-3">
              <label className="form-label small">Tổng tiền hàng</label>
              <input
                className="form-control bg-light text-end fw-semibold"
                value={fmt(subTotal)}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Chiết khấu tổng HĐ</label>
              <input
                type="number"
                className="form-control text-end"
                value={invoiceInfo.invDiscAmount}
                onChange={(e) =>
                  setInvoiceInfo({
                    ...invoiceInfo,
                    invDiscAmount: +e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">Tổng tiền thuế</label>
              <input
                className="form-control bg-light text-end fw-semibold text-primary"
                value={fmt(totalVat)}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">
                TỔNG CỘNG THANH TOÁN
              </label>
              <input
                className="form-control total-amount text-end fw-bold"
                value={fmt(totalAmount)}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          className="btn btn-publish btn-lg px-5"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              <i className="ri-send-plane-fill me-2" />
              {actionMode === "issue" && "PHÁT HÀNH HÓA ĐƠN"}
              {actionMode === "replace" && "THAY THẾ HÓA ĐƠN"}
              {actionMode === "adjust" && "ĐIỀU CHỈNH HÓA ĐƠN"}
            </>
          )}
        </button>
      </div>

      {/* V. Tiện Ích & Công Cụ */}
      <div className="card inv-card mt-5 mb-4 border-info">
        <div className="card-header inv-card-header bg-info text-white">
          <i className="ri-tools-fill me-2" />
          V. Tiện Ích & Công Cụ
        </div>
        <div className="card-body">
          <div className="row">
            {/* Block 1: Export & Print */}
            <div className="col-md-6 border-end">
              <h6 className="fw-bold mb-3">Tải XML & In Hóa Đơn PDF</h6>
              <div className="mb-3">
                <label className="form-label small">
                  Mã Giao Dịch (Transaction ID)
                </label>
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Nhập transactionId..."
                    value={utilTransactionId}
                    onChange={(e) => setUtilTransactionId(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setUtilTransactionId(transactionID)}
                  >
                    Dùng ID hiện tại
                  </button>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-success"
                  onClick={handleExportXml}
                  disabled={isUtilLoading}
                >
                  <i className="ri-file-download-line me-1" /> Tải XML Base64
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={handlePrintPdf}
                  disabled={isUtilLoading}
                >
                  <i className="ri-printer-line me-1" /> In Hóa Đơn PDF
                </button>
              </div>
            </div>

            {/* Block 2: Check Tax */}
            <div className="col-md-6">
              <h6 className="fw-bold mb-3">Kiểm Tra Trạng Thái Thuế</h6>
              <div className="mb-3">
                <label className="form-label small">
                  Danh sách Mã Số Thuế (mỗi MST 1 dòng hoặc cách nhau dấu phẩy)
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="0101243150, 0100109106..."
                  value={taxCodesInput}
                  onChange={(e) => setTaxCodesInput(e.target.value)}
                ></textarea>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleCheckTax}
                disabled={isUtilLoading}
              >
                <i className="ri-search-line me-1" /> Kiểm Tra
              </button>
            </div>
          </div>

          {taxResults.length > 0 && (
            <div className="mt-4">
              <h6 className="fw-bold">Kết quả Kiểm Tra:</h6>
              <div className="table-responsive">
                <table className="table table-sm table-bordered table-striped mt-2">
                  <thead className="table-light">
                    <tr>
                      <th>Mã Số Thuế</th>
                      <th>Tên Công Ty</th>
                      <th>Trạng Thái</th>
                      <th>Tình Trạng Chi Tiết</th>
                      <th>Cập nhật lúc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxResults.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <strong>{r.maSoThue}</strong>
                        </td>
                        <td>{r.tenCty}</td>
                        <td>
                          <span
                            className={`badge ${r.tthai.includes("00") ? "bg-success" : "bg-warning text-dark"}`}
                          >
                            {r.tthai}
                          </span>
                        </td>
                        <td>{r.trangThaiHoatDong}</td>
                        <td>{r.lastUpdate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
