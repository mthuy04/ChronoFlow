"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <PaymentResultContent />
    </Suspense>
  );
}

function PaymentResultFallback() {
  return (
    <main className="min-h-screen bg-[#F4F2FA] px-4 py-16 font-sans text-[#1A1528]">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <div className="rounded-[32px] border border-white bg-white/90 px-6 py-5 text-center text-sm font-semibold text-[#6B647C] shadow-[0_24px_70px_rgba(26,21,40,0.08)] backdrop-blur-xl">
          Đang tải kết quả thanh toán...
        </div>
      </div>
    </main>
  );
}

function PaymentResultContent() {
  const searchParams = useSearchParams();

  const responseCode = searchParams.get("vnp_ResponseCode");
  const transactionStatus = searchParams.get("vnp_TransactionStatus");
  const amount = searchParams.get("vnp_Amount");
  const txnRef = searchParams.get("vnp_TxnRef");

  const success = responseCode === "00" && transactionStatus === "00";

  const displayAmount = amount
    ? `${(Number(amount) / 100).toLocaleString("vi-VN")}đ`
    : "Không xác định";

  return (
    <main className="min-h-screen bg-[#F4F2FA] px-4 py-16 font-sans text-[#1A1528]">
      <div className="mx-auto max-w-xl rounded-[36px] border border-white bg-white p-8 text-center shadow-[0_30px_100px_rgba(26,21,40,0.08)]">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[24px] ${
            success
              ? "bg-[#ECFDF5] text-[#10B981]"
              : "bg-[#FEF2F2] text-[#EF4444]"
          }`}
        >
          {success ? (
            <CheckCircle2 className="h-8 w-8" />
          ) : (
            <XCircle className="h-8 w-8" />
          )}
        </div>

        <h1 className="text-3xl font-[900]">
          {success ? "Thanh toán thành công" : "Thanh toán chưa hoàn tất"}
        </h1>

        <p className="mt-3 text-sm font-semibold leading-relaxed text-[#6B647C]">
          {success
            ? "ChronoFlow đã ghi nhận giao dịch của bạn."
            : "Giao dịch bị hủy hoặc chưa được xác nhận. Bạn có thể thử lại sau."}
        </p>

        <div className="mt-6 rounded-[24px] bg-[#F8F9FE] p-4 text-left text-sm font-semibold text-[#5B566E]">
          <div className="flex justify-between gap-4">
            <span>Mã giao dịch</span>
            <span className="font-[900] text-[#1A1528]">
              {txnRef ?? "N/A"}
            </span>
          </div>

          <div className="mt-2 flex justify-between gap-4">
            <span>Số tiền</span>
            <span className="font-[900] text-[#1A1528]">
              {displayAmount}
            </span>
          </div>
        </div>

        <Link
          href={success ? "/dashboard" : "/#pricing"}
          className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-sm font-bold text-white shadow-xl"
        >
          {success ? "Vào dashboard" : "Quay lại Pricing"}
          <ArrowRight className="h-4 w-4 text-[#4DA8FF]" />
        </Link>
      </div>
    </main>
  );
}