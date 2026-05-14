"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  CreditCard,
  Gift,
  Loader2,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TimerReset,
  WalletCards,
} from "lucide-react";

import { formatVnd, getCheckoutItem } from "@/lib/pricing";

type OrderStatus =
  | "PENDING"
  | "PAID"
  | "EXPIRED"
  | "CANCELLED"
  | "AMOUNT_MISMATCH"
  | "FAILED"
  | "REFUNDED";

type CheckoutOrder = {
  orderId: string;
  itemKey: string;
  itemName: string;
  itemType: string;
  status: OrderStatus;
  transferCode: string;
  qrUrl: string | null;
  amount: number;
  currency: string;
  paidAmount?: number | null;
  paidAt?: string | null;
  expiresAt: string | null;
  createdAt: string;
  bank: {
    bankId: string;
    accountNo: string;
    accountName: string;
  };
};

type CreateOrderResponse = {
  message?: string;
  loginUrl?: string;
  order?: CheckoutOrder;
};

type ReadOrderResponse = {
  message?: string;
  order?: CheckoutOrder;
};

const POLLING_INTERVAL_MS = 4000;

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutPageFallback />}>
      <CheckoutPageContent />
    </Suspense>
  );
}

function CheckoutPageFallback() {
  return (
    <main className="min-h-screen bg-[#F4F2FA] px-4 py-16 font-sans text-[#1A1528]">
      <BackgroundDots />
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <div className="rounded-[32px] border border-white bg-white/90 px-6 py-5 text-center text-sm font-semibold text-[#6B647C] shadow-[0_24px_70px_rgba(26,21,40,0.08)] backdrop-blur-xl">
          Đang tải trang thanh toán...
        </div>
      </div>
    </main>
  );
}

function CheckoutPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const plan = searchParams.get("plan");
  const product = searchParams.get("product");
  const itemKey = plan ?? product;
  const item = useMemo(() => getCheckoutItem(itemKey), [itemKey]);

  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [creating, setCreating] = useState(false);
  const [polling, setPolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const trackedPurchaseRef = useRef<string | null>(null);

  const callbackUrl = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  async function createOrder() {
    if (!item) return;

    try {
      setCreating(true);
      setErrorMessage(null);

      const response = await fetch("/api/checkout/bank-transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          itemKey: item.key,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | CreateOrderResponse
        | null;

      if (response.status === 401) {
        const encodedCallback = encodeURIComponent(callbackUrl);
        router.push(
          data?.loginUrl ?? `/auth/login?callbackUrl=${encodedCallback}`,
        );
        return;
      }

      if (!response.ok || !data?.order) {
        throw new Error(data?.message || "Không tạo được đơn thanh toán.");
      }

      setOrder(data.order);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Có lỗi khi tạo QR chuyển khoản. Vui lòng thử lại.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function refreshOrderStatus(orderId: string) {
    try {
      setPolling(true);

      const response = await fetch(`/api/checkout/orders/${orderId}`, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      const data = (await response.json().catch(() => null)) as
        | ReadOrderResponse
        | null;

      if (!response.ok || !data?.order) {
        throw new Error(
          data?.message || "Không đọc được trạng thái thanh toán.",
        );
      }

      setOrder(data.order);
      return data.order;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setPolling(false);
    }
  }

  async function copyTransferCode() {
    if (!order) return;

    await navigator.clipboard.writeText(order.transferCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function copyBankInfo() {
    if (!order) return;

    const text = [
      `Ngân hàng: ${order.bank.bankId}`,
      `Số tài khoản: ${order.bank.accountNo}`,
      `Chủ tài khoản: ${order.bank.accountName}`,
      `Số tiền: ${formatVnd(order.amount)}`,
      `Nội dung: ${order.transferCode}`,
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  useEffect(() => {
    if (!order || order.status !== "PENDING") return;
  
    const intervalId = window.setInterval(() => {
      void refreshOrderStatus(order.orderId);
    }, POLLING_INTERVAL_MS);
  
    return () => {
      window.clearInterval(intervalId);
    };
  }, [order?.orderId, order?.status]);
  
  useEffect(() => {
    if (!order || order.status !== "PAID") return;
    if (trackedPurchaseRef.current === order.orderId) return;
  
    const storageKey = `chronoflow_ga4_purchase_${order.orderId}`;
  
    try {
      if (window.localStorage.getItem(storageKey) === "tracked") return;
    } catch {
      // Ignore localStorage errors.
    }
  
    trackedPurchaseRef.current = order.orderId;
  
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "purchase", {
        transaction_id: order.orderId,
        value: order.amount,
        currency: order.currency || "VND",
        items: [
          {
            item_id: order.itemKey,
            item_name: order.itemName,
            item_category: order.itemType,
            price: order.amount,
            quantity: 1,
          },
        ],
      });
  
      try {
        window.localStorage.setItem(storageKey, "tracked");
      } catch {
        // Ignore localStorage errors.
      }
    }
  }, [order]);
  

  if (!item) {
    return (
      <main className="min-h-screen bg-[#F4F2FA] px-4 py-16 font-sans text-[#1A1528]">
        <div className="mx-auto max-w-xl rounded-[32px] border border-white bg-white p-8 text-center shadow-[0_24px_70px_rgba(26,21,40,0.08)]">
          <h1 className="text-2xl font-[900]">Không tìm thấy gói thanh toán</h1>
          <p className="mt-3 text-sm font-semibold text-[#6B647C]">
            Vui lòng quay lại Pricing và chọn lại gói phù hợp.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-flex rounded-2xl bg-[#1A1528] px-5 py-3 text-sm font-bold text-white"
          >
            Quay lại Pricing
          </Link>
        </div>
      </main>
    );
  }

  const isPaid = order?.status === "PAID";
  const isExpired = order?.status === "EXPIRED";
  const isAmountMismatch = order?.status === "AMOUNT_MISMATCH";

  return (
    <main className="min-h-screen bg-[#F4F2FA] px-4 py-10 font-sans text-[#1A1528]">
      <BackgroundDots />

      <div className="relative z-10 mx-auto max-w-[1120px]">
        <Link
          href="/pricing"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6F59FF]"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Pricing
        </Link>

        <div className="overflow-hidden rounded-[40px] border border-white bg-white/80 p-5 shadow-[0_30px_100px_rgba(26,21,40,0.08)] backdrop-blur-2xl md:p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F3F0FF] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#6F59FF]">
              <Sparkles className="h-3.5 w-3.5" />
              SePay Auto Confirm
            </div>

            <h1 className="text-[clamp(2rem,4vw,3.2rem)] font-[900] leading-tight">
              Thanh toán ChronoFlow
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-[#6B647C] md:text-base">
              Quét QR và giữ đúng nội dung chuyển khoản. Hệ thống sẽ tự xác nhận
              khi SePay ghi nhận tiền vào.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-[24px] border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm font-semibold text-[#B91C1C]">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[32px] border border-[#EEF0F6] bg-white p-6 shadow-[0_18px_55px_rgba(26,21,40,0.05)]">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white">
                  {item.type === "product" ? (
                    <Gift className="h-6 w-6" />
                  ) : (
                    <WalletCards className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <div className="mb-2 inline-flex rounded-full bg-[#F8F9FE] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                    {item.type === "product" ? "Planner Kit" : "Subscription"}
                  </div>

                  <h2 className="text-2xl font-[900]">{item.name}</h2>

                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[#6B647C]">
                    {item.description}
                  </p>

                  {item.trial && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-black text-[#10B981]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {item.trial}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#EEF0F6] bg-[#F8F9FE] p-5">
                <h3 className="mb-4 text-lg font-[900]">Tóm tắt đơn hàng</h3>

                <div className="space-y-3 text-sm font-semibold text-[#5B566E]">
                  <SummaryRow label="Sản phẩm" value={item.name} />
                  <SummaryRow label="Giá" value={item.displayPrice} />
                  <SummaryRow label="Phí dịch vụ" value="0đ" />
                </div>

                <div className="my-5 h-px bg-[#E9E5FF]" />

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                      Tổng thanh toán
                    </div>
                    <div className="mt-1 text-3xl font-[900] text-[#1A1528]">
                      {formatVnd(item.price)}
                    </div>
                  </div>
                </div>

                {!order && (
                  <button
                    type="button"
                    onClick={createOrder}
                    disabled={creating}
                    className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang tạo QR...
                      </>
                    ) : (
                      <>
                        Tạo QR chuyển khoản
                        <QrCode className="h-4 w-4 text-[#4DA8FF]" />
                      </>
                    )}
                  </button>
                )}

                {order && !isPaid && (
                  <button
                    type="button"
                    onClick={() => void refreshOrderStatus(order.orderId)}
                    disabled={polling}
                    className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-[#DCD7FF] bg-white px-5 text-sm font-bold text-[#6F59FF] shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {polling ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang kiểm tra...
                      </>
                    ) : (
                      <>
                        Kiểm tra trạng thái
                        <RefreshCw className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <InfoCard
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Tự xác nhận"
                  desc="Qua SePay webhook"
                />
                <InfoCard
                  icon={<CreditCard className="h-4 w-4" />}
                  title="Không cần bill"
                  desc="Không upload thủ công"
                />
                <InfoCard
                  icon={<TimerReset className="h-4 w-4" />}
                  title="Polling"
                  desc="Tự kiểm tra trạng thái"
                />
              </div>
            </section>

            <section className="rounded-[32px] border border-[#EEF0F6] bg-white p-6 shadow-[0_18px_55px_rgba(26,21,40,0.05)]">
              {!order ? (
                <EmptyQrPanel />
              ) : isPaid ? (
                <SuccessPanel order={order} />
              ) : isExpired ? (
                <ExpiredPanel onCreateOrder={createOrder} creating={creating} />
              ) : isAmountMismatch ? (
                <AmountMismatchPanel order={order} />
              ) : (
                <PendingPaymentPanel
                  order={order}
                  copied={copied}
                  polling={polling}
                  onCopyTransferCode={copyTransferCode}
                  onCopyBankInfo={copyBankInfo}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function EmptyQrPanel() {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#DCD7FF] bg-[#F8F9FE] p-8 text-center">
      <QrCode className="mb-4 h-12 w-12 text-[#6F59FF]" />
      <h3 className="text-xl font-[900]">Chưa tạo QR chuyển khoản</h3>
      <p className="mt-2 max-w-sm text-sm font-semibold leading-relaxed text-[#6B647C]">
        Bấm “Tạo QR chuyển khoản” để hệ thống tạo mã đơn riêng và QR ngân hàng.
      </p>
    </div>
  );
}

function SuccessPanel({ order }: { order: CheckoutOrder }) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[28px] border border-[#D1FAE5] bg-[#ECFDF5] p-8 text-center">
      <CheckCircle2 className="mb-4 h-14 w-14 text-[#10B981]" />
      <h3 className="text-2xl font-[900] text-[#047857]">
        Thanh toán thành công
      </h3>
      <p className="mt-2 max-w-md text-sm font-semibold leading-relaxed text-[#047857]/80">
        SePay đã ghi nhận giao dịch của bạn. Đơn {order.orderId} đã được xác
        nhận tự động.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-[#1A1528] px-5 text-sm font-bold text-white"
      >
        Vào dashboard
      </Link>
    </div>
  );
}

function ExpiredPanel({
  onCreateOrder,
  creating,
}: {
  onCreateOrder: () => void;
  creating: boolean;
}) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[28px] border border-[#FED7AA] bg-[#FFF7ED] p-8 text-center">
      <AlertCircle className="mb-4 h-14 w-14 text-[#F59E0B]" />
      <h3 className="text-2xl font-[900] text-[#9A3412]">QR đã hết hạn</h3>
      <p className="mt-2 max-w-md text-sm font-semibold leading-relaxed text-[#9A3412]/80">
        Đơn thanh toán đã quá thời gian chờ. Bạn có thể tạo QR mới để tiếp tục.
      </p>

      <button
        type="button"
        onClick={onCreateOrder}
        disabled={creating}
        className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-sm font-bold text-white disabled:opacity-70"
      >
        {creating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <QrCode className="h-4 w-4" />
        )}
        Tạo QR mới
      </button>
    </div>
  );
}

function AmountMismatchPanel({ order }: { order: CheckoutOrder }) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[28px] border border-[#FECACA] bg-[#FEF2F2] p-8 text-center">
      <AlertCircle className="mb-4 h-14 w-14 text-[#EF4444]" />
      <h3 className="text-2xl font-[900] text-[#B91C1C]">
        Số tiền chưa khớp
      </h3>
      <p className="mt-2 max-w-md text-sm font-semibold leading-relaxed text-[#B91C1C]/80">
        Hệ thống đã nhận giao dịch nhưng số tiền không khớp đơn hàng. Vui lòng
        liên hệ hỗ trợ kèm mã đơn {order.orderId}.
      </p>

      <Link
        href="/contact"
        className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-[#1A1528] px-5 text-sm font-bold text-white"
      >
        Liên hệ hỗ trợ
      </Link>
    </div>
  );
}

function PendingPaymentPanel({
  order,
  copied,
  polling,
  onCopyTransferCode,
  onCopyBankInfo,
}: {
  order: CheckoutOrder;
  copied: boolean;
  polling: boolean;
  onCopyTransferCode: () => void;
  onCopyBankInfo: () => void;
}) {
  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#6F59FF]">
            Chuyển khoản ngân hàng
          </div>
          <h3 className="text-2xl font-[900]">Quét QR để thanh toán</h3>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-[#6B647C]">
            Sau khi tiền vào tài khoản, SePay sẽ tự xác nhận. Không cần upload
            bill.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF7ED] px-3 py-2 text-xs font-black text-[#F59E0B]">
          {polling ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <TimerReset className="h-3.5 w-3.5" />
          )}
          Đang chờ
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[260px_1fr]">
        <div className="rounded-[28px] border border-[#EEF0F6] bg-[#F8F9FE] p-4">
          <div className="overflow-hidden rounded-[22px] bg-white p-3 shadow-sm">
            {order.qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={order.qrUrl}
                alt="QR chuyển khoản ChronoFlow"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-[18px] bg-[#F3F0FF] text-[#6F59FF]">
                <QrCode className="h-12 w-12" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <BankRow label="Ngân hàng" value={order.bank.bankId} />
          <BankRow label="Số tài khoản" value={order.bank.accountNo} />
          <BankRow label="Chủ tài khoản" value={order.bank.accountName} />
          <BankRow label="Số tiền" value={formatVnd(order.amount)} highlight />

          <div className="rounded-[22px] border border-[#FFE6C7] bg-[#FFF7ED] p-4">
            <div className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-[#F59E0B]">
              Nội dung chuyển khoản
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-[900] text-[#1A1528]">
                {order.transferCode}
              </div>
              <button
                type="button"
                onClick={onCopyTransferCode}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#F59E0B] shadow-sm"
                title="Copy nội dung"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-[#E9E5FF] bg-[#F8F9FE] p-5">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-[900]">Hệ thống đang tự động kiểm tra</h4>
            <p className="mt-1 text-xs font-semibold leading-6 text-[#8A84A3]">
              Vui lòng chuyển đúng số tiền và đúng nội dung. Trang này sẽ tự cập
              nhật sau vài giây khi SePay gửi webhook.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCopyBankInfo}
          className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
          ) : (
            <Clipboard className="h-4 w-4 text-[#4DA8FF]" />
          )}
          Copy toàn bộ thông tin chuyển khoản
        </button>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[22px] border border-[#EEF0F6] bg-[#F8F9FE] p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#6F59FF] shadow-sm">
        {icon}
      </div>
      <div className="text-sm font-[900]">{title}</div>
      <div className="mt-1 text-xs font-semibold text-[#8A84A3]">{desc}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="text-right font-[900] text-[#1A1528]">{value}</span>
    </div>
  );
}

function BankRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[20px] border p-4 ${
        highlight
          ? "border-[#FFE6C7] bg-[#FFF7ED]"
          : "border-[#EEF0F6] bg-[#F8F9FE]"
      }`}
    >
      <div className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="text-base font-[900] text-[#1A1528]">{value}</div>
    </div>
  );
}

function BackgroundDots() {
  return (
    <div
      className="pointer-events-none fixed inset-0 opacity-35 mix-blend-multiply"
      style={{
        backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}