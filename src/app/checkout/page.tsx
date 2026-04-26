"use client";

import { useMemo, useState, Suspense } from "react"; // Đã thêm Suspense
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  CreditCard,
  Gift,
  Loader2,
  Package,
  QrCode,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  WalletCards,
} from "lucide-react";
import { getCheckoutItem, formatVnd } from "@/lib/pricing";

type CreatedOrder = {
  orderId: string;
  transferCode: string;
  qrUrl: string;
  amount: number;
  bank: {
    bankId: string;
    accountNo: string;
    accountName: string;
  };
};

// --- TÁCH TOÀN BỘ NỘI DUNG VÀO ĐÂY ---
function CheckoutContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const product = searchParams.get("product");

  const itemKey = plan ?? product;
  const item = useMemo(() => getCheckoutItem(itemKey), [itemKey]);

  const [order, setOrder] = useState<CreatedOrder | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function createOrder() {
    if (!item) return;

    try {
      setCreating(true);

      const res = await fetch("/api/checkout/bank-transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemKey: item.key,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Không tạo được đơn thanh toán.");
      }

      setOrder(data.order);
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi tạo QR chuyển khoản. Vui lòng thử lại.");
    } finally {
      setCreating(false);
    }
  }

  function handleProofChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  }

  async function copyTransferCode() {
    if (!order) return;

    await navigator.clipboard.writeText(order.transferCode);
    setCopied(true);

    setTimeout(() => setCopied(false), 1600);
  }

  async function confirmTransfer() {
    if (!order) return;

    try {
      setConfirming(true);

      const formData = new FormData();
      formData.append("orderId", order.orderId);
      if (proofFile) {
        formData.append("proof", proofFile);
      }

      const res = await fetch("/api/checkout/confirm-transfer", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Không xác nhận được giao dịch.");
      }

      setConfirmed(true);
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi xác nhận. Vui lòng thử lại.");
    } finally {
      setConfirming(false);
    }
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-xl rounded-[32px] border border-white bg-white p-8 text-center shadow-[0_24px_70px_rgba(26,21,40,0.08)]">
        <h1 className="text-2xl font-[900]">Không tìm thấy gói thanh toán</h1>
        <p className="mt-3 text-sm font-semibold text-[#6B647C]">
          Vui lòng quay lại Pricing và chọn lại gói phù hợp.
        </p>
        <Link
          href="/#pricing"
          className="mt-6 inline-flex rounded-2xl bg-[#1A1528] px-5 py-3 text-sm font-bold text-white"
        >
          Quay lại Pricing
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-[1120px]">
      <Link
        href="/#pricing"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6F59FF]"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Pricing
      </Link>

      <div className="overflow-hidden rounded-[40px] border border-white bg-white/80 p-5 shadow-[0_30px_100px_rgba(26,21,40,0.08)] backdrop-blur-2xl md:p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F3F0FF] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#6F59FF]">
            <Sparkles className="h-3.5 w-3.5" />
            Checkout
          </div>

          <h1 className="text-[clamp(2rem,4vw,3.2rem)] font-[900] leading-tight">
            Thanh toán ChronoFlow
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-[#6B647C] md:text-base">
            Chuyển khoản đúng số tiền và đúng nội dung để đơn được xác nhận nhanh hơn.
          </p>
        </div>

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
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <InfoCard
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Thanh toán thật"
                desc="Qua tài khoản ngân hàng"
              />
              <InfoCard
                icon={<CreditCard className="h-4 w-4" />}
                title="Dễ xác nhận"
                desc="Dùng mã đơn riêng"
              />
              <InfoCard
                icon={<Package className="h-4 w-4" />}
                title="Có thể tự động"
                desc="Sẵn flow webhook"
              />
            </div>
          </section>

          <section className="rounded-[32px] border border-[#EEF0F6] bg-white p-6 shadow-[0_18px_55px_rgba(26,21,40,0.05)]">
            {!order ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#DCD7FF] bg-[#F8F9FE] p-8 text-center">
                <QrCode className="mb-4 h-12 w-12 text-[#6F59FF]" />
                <h3 className="text-xl font-[900]">Chưa tạo QR chuyển khoản</h3>
                <p className="mt-2 max-w-sm text-sm font-semibold leading-relaxed text-[#6B647C]">
                  Bấm “Tạo QR chuyển khoản” để hệ thống tạo mã đơn riêng và QR ngân hàng.
                </p>
              </div>
            ) : confirmed ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[28px] border border-[#D1FAE5] bg-[#ECFDF5] p-8 text-center">
                <CheckCircle2 className="mb-4 h-14 w-14 text-[#10B981]" />
                <h3 className="text-2xl font-[900] text-[#047857]">
                  Đã gửi xác nhận
                </h3>
                <p className="mt-2 max-w-md text-sm font-semibold leading-relaxed text-[#047857]/80">
                  Đơn của bạn đang chờ kiểm tra. Khi giao dịch được xác nhận, gói
                  Plus/Pro sẽ được kích hoạt hoặc Planner Kit sẽ được xử lý giao hàng.
                </p>

                <Link
                  href="/dashboard"
                  className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-[#1A1528] px-5 text-sm font-bold text-white"
                >
                  Vào dashboard
                </Link>
              </div>
            ) : (
              <div>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                      Chuyển khoản ngân hàng
                    </div>
                    <h3 className="text-2xl font-[900]">Quét QR để thanh toán</h3>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-[#6B647C]">
                      Vui lòng chuyển đúng số tiền và giữ nguyên nội dung chuyển khoản.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-[260px_1fr]">
                  <div className="rounded-[28px] border border-[#EEF0F6] bg-[#F8F9FE] p-4">
                    <div className="overflow-hidden rounded-[22px] bg-white p-3 shadow-sm">
                      <img
                        src={order.qrUrl}
                        alt="QR chuyển khoản ChronoFlow"
                        className="h-full w-full object-contain"
                      />
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
                          onClick={copyTransferCode}
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

                <div className="mt-6 rounded-[28px] border border-[#EEF0F6] bg-[#F8F9FE] p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-[900]">Upload bill chuyển khoản</h4>
                      <p className="text-xs font-semibold text-[#8A84A3]">
                        Không bắt buộc, nhưng giúp admin xác nhận nhanh hơn.
                      </p>
                    </div>
                  </div>

                  <label className="block cursor-pointer rounded-[22px] border border-dashed border-[#DCD7FF] bg-white p-4 text-center transition hover:border-[#6F59FF]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProofChange}
                    />

                    {proofPreview ? (
                      <img
                        src={proofPreview}
                        alt="Bill preview"
                        className="mx-auto max-h-[180px] rounded-2xl object-contain"
                      />
                    ) : (
                      <div className="py-5">
                        <UploadCloud className="mx-auto mb-2 h-8 w-8 text-[#6F59FF]" />
                        <div className="text-sm font-bold text-[#1A1528]">
                          Chọn ảnh bill
                        </div>
                        <div className="mt-1 text-xs font-semibold text-[#8A84A3]">
                          PNG, JPG hoặc JPEG
                        </div>
                      </div>
                    )}
                  </label>

                  <button
                    onClick={confirmTransfer}
                    disabled={confirming}
                    className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {confirming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang gửi xác nhận...
                      </>
                    ) : (
                      <>
                        Tôi đã chuyển khoản
                        <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT CHÍNH (XUẤT RA NGOÀI) ---
export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#F4F2FA] px-4 py-10 font-sans text-[#1A1528]">
      <div
        className="pointer-events-none fixed inset-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      
      {/* Bọc toàn bộ nội dung trong Suspense để fix lỗi useSearchParams */}
      <Suspense fallback={
        <div className="mx-auto max-w-xl py-20 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#6F59FF]" />
          <p className="mt-4 font-bold text-[#6B647C]">Đang chuẩn bị thanh toán...</p>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}

// --- GIỮ NGUYÊN CÁC COMPONENT PHỤ CỦA BẠN ---
function InfoCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-[22px] border border-[#EEF0F6] bg-[#F8F9FE] p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#6F59FF] shadow-sm">{icon}</div>
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

function BankRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-[20px] border p-4 ${highlight ? "border-[#FFE6C7] bg-[#FFF7ED]" : "border-[#EEF0F6] bg-[#F8F9FE]"}`}>
      <div className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-[#8A84A3]">{label}</div>
      <div className="text-base font-[900] text-[#1A1528]">{value}</div>
    </div>
  );
}