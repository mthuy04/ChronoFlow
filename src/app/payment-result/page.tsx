"use client";

import { Suspense, useEffect } from "react"; // Đã thêm useEffect để bắn tracking
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { sendGAEvent } from '@next/third-parties/google'; // Import "mắt thần" GA4

function PaymentResultContent() {
  const searchParams = useSearchParams();

  const responseCode = searchParams.get("vnp_ResponseCode");
  const transactionStatus = searchParams.get("vnp_TransactionStatus");
  const amount = searchParams.get("vnp_Amount");
  const txnRef = searchParams.get("vnp_TxnRef");

  const success = responseCode === "00" && transactionStatus === "00";

  // --- LOGIC TRACKING CHUYÊN SÂU ---
  useEffect(() => {
    if (success) {
      // 1. Tracking sự kiện Mua hàng (Purchase) - Cực kỳ quan trọng cho BA
      sendGAEvent({
        event: 'purchase',
        transaction_id: txnRef || 'N/A',
        value: amount ? Number(amount) / 100 : 0, // Chuyển đơn vị từ VNPAY về tiền thật
        currency: 'VND',
        items: [{
          item_name: 'ChronoFlow Premium Plan',
          item_category: 'Subscription',
          quantity: 1
        }]
      });
    } else if (responseCode && responseCode !== "00") {
      // 2. Tracking sự kiện lỗi thanh toán để phân tích lý do rớt đơn
      sendGAEvent({
        event: 'payment_failed',
        error_code: responseCode,
        transaction_id: txnRef || 'N/A'
      });
    }
  }, [success, responseCode, amount, txnRef]);

  const displayAmount = amount
    ? `${(Number(amount) / 100).toLocaleString("vi-VN")}đ`
    : "Không xác định";

  return (
    <div className="mx-auto max-w-xl rounded-[36px] border border-white bg-white p-8 text-center shadow-[0_30px_100px_rgba(26,21,40,0.08)]">
      <div
        className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[24px] ${
          success ? "bg-[#ECFDF5] text-[#10B981]" : "bg-[#FEF2F2] text-[#EF4444]"
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
          <span className="font-[900] text-[#1A1528]">{txnRef ?? "N/A"}</span>
        </div>
        <div className="mt-2 flex justify-between gap-4">
          <span>Số tiền</span>
          <span className="font-[900] text-[#1A1528]">{displayAmount}</span>
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
  );
}

export default function PaymentResultPage() {
  return (
    <main className="min-h-screen bg-[#F4F2FA] px-4 py-16 font-sans text-[#1A1528]">
      <Suspense fallback={
        <div className="mx-auto max-w-xl rounded-[36px] border border-white bg-white p-12 text-center shadow-lg">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#6F59FF]" />
          <p className="mt-4 font-bold text-[#6B647C]">Đang kiểm tra kết quả giao dịch...</p>
        </div>
      }>
        <PaymentResultContent />
      </Suspense>
    </main>
  );
}