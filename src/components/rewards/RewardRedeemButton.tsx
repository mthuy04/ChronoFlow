"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Coins,
  Gift,
  Loader2,
  Lock,
  Sparkles,
  X,
} from "lucide-react";
import { emitCoinLanded } from "@/lib/coin-reward-events";

type RedeemResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  detail?: string;
  redemption?: {
    id: string;
    rewardItemId?: string;
    userId?: string;
    pointsCost?: number;
    status?: string;
    createdAt?: string;
  };
  nextCoinBalance?: number;
};

type RewardRedeemButtonProps = {
  rewardItemId: string;
  rewardTitle: string;
  pointsCost: number;
  currentBalance: number;
  canRedeem: boolean;
  isOutOfStock?: boolean;
  disabledReason?: string;
  defaultRecipientName?: string;
};

type RedeemState = "idle" | "confirming" | "loading" | "success" | "error";

type RedeemForm = {
  recipientName: string;
  phone: string;
  address: string;
  note: string;
};

function formatNumber(value: number) {
  return value.toLocaleString("vi-VN");
}

export default function RewardRedeemButton({
  rewardItemId,
  rewardTitle,
  pointsCost,
  currentBalance,
  canRedeem,
  isOutOfStock = false,
  disabledReason = "Chưa đủ coin",
  defaultRecipientName = "",
}: RewardRedeemButtonProps) {
  const router = useRouter();

  const [state, setState] = useState<RedeemState>("idle");
  const [message, setMessage] = useState("");
  const [nextBalance, setNextBalance] = useState<number | null>(null);
  const [form, setForm] = useState<RedeemForm>({
    recipientName: defaultRecipientName,
    phone: "",
    address: "",
    note: "",
  });

  const missingCoins = useMemo(() => {
    return Math.max(0, pointsCost - currentBalance);
  }, [currentBalance, pointsCost]);

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isConfirming = state === "confirming";
  const isError = state === "error";

  const disabled = !canRedeem || isOutOfStock || isLoading || isSuccess;

  function updateForm<K extends keyof RedeemForm>(key: K, value: RedeemForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openConfirm() {
    if (!canRedeem || isOutOfStock || disabled) return;

    setMessage("");
    setNextBalance(null);
    setState("confirming");
  }

  function closeConfirm() {
    if (isLoading) return;

    setMessage("");
    setState("idle");
  }

  function validateForm() {
    if (!form.recipientName.trim()) {
      return "Vui lòng nhập họ tên nhận quà.";
    }

    if (!form.phone.trim()) {
      return "Vui lòng nhập số điện thoại.";
    }

    if (!/^[0-9+\-\s()]{8,20}$/.test(form.phone.trim())) {
      return "Số điện thoại chưa hợp lệ.";
    }

    if (!form.address.trim()) {
      return "Vui lòng nhập địa chỉ nhận quà.";
    }

    return null;
  }

  async function handleRedeem() {
    if (!canRedeem || isOutOfStock || isLoading || isSuccess) return;

    const validationError = validateForm();

    if (validationError) {
      setState("error");
      setMessage(validationError);
      return;
    }

    try {
      setState("loading");
      setMessage("");
      setNextBalance(null);

      const response = await fetch("/api/dashboard/rewards/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rewardItemId,
          recipientName: form.recipientName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          note: form.note.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | RedeemResponse
        | null;

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.error ||
            data?.message ||
            data?.detail ||
            "Không thể đổi phần thưởng.",
        );
      }

      setState("success");
      setNextBalance(
        typeof data.nextCoinBalance === "number" ? data.nextCoinBalance : null,
      );
      setMessage(
        data.message ||
          `Đã gửi yêu cầu đổi "${rewardTitle}". ChronoFlow sẽ xử lý sớm nhất có thể.`,
      );

      if (typeof data.nextCoinBalance === "number") {
        emitCoinLanded({
          amount: -pointsCost,
          nextBalance: data.nextCoinBalance,
        });
      }

      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể đổi phần thưởng.",
      );
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={isConfirming ? undefined : openConfirm}
        disabled={disabled}
        className={`group inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl px-4 text-[13px] font-black transition ${
          isSuccess
            ? "bg-[#F1FFF7] text-[#23965F] shadow-[0_10px_24px_rgba(35,150,95,0.10)]"
            : canRedeem && !isOutOfStock
              ? "bg-[#1A152E] text-white shadow-[0_14px_28px_rgba(26,21,46,0.14)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(26,21,46,0.18)]"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang gửi yêu cầu...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Đã gửi yêu cầu
          </>
        ) : isOutOfStock ? (
          <>
            <Lock className="h-4 w-4" />
            Hết hàng
          </>
        ) : canRedeem ? (
          <>
            <Gift className="h-4 w-4 transition group-hover:rotate-6" />
            Đổi quà
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            {missingCoins > 0
              ? `Cần thêm ${formatNumber(missingCoins)} coin`
              : disabledReason}
          </>
        )}
      </button>

      {!canRedeem || isOutOfStock ? (
        <div className="mt-3 rounded-2xl border border-[#EEE9FF] bg-[#FCFBFF] px-3 py-2 text-[12px] font-semibold leading-5 text-[#7B7592]">
          {isOutOfStock ? (
            "Phần thưởng này hiện đã hết hàng."
          ) : (
            <>
              Bạn hiện có{" "}
              <span className="font-black text-[#241F3D]">
                {formatNumber(currentBalance)}
              </span>{" "}
              coin. Phần thưởng này cần{" "}
              <span className="font-black text-[#9A6B00]">
                {formatNumber(pointsCost)}
              </span>{" "}
              coin.
            </>
          )}
        </div>
      ) : null}

      {isConfirming ? (
        <div className="mt-3 overflow-hidden rounded-[22px] border border-[#FFE7A8] bg-[linear-gradient(180deg,#FFFDF5_0%,#FFF8DC_100%)] p-4 shadow-[0_12px_28px_rgba(255,183,3,0.10)]">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#FFD166_0%,#FFB703_100%)] text-white shadow-[0_12px_24px_rgba(255,183,3,0.22)]">
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-black leading-5 text-[#241F3D]">
                Thông tin nhận phần thưởng
              </div>

              <p className="mt-1 text-[12px] leading-6 text-[#7A6A42]">
                Bạn sẽ dùng{" "}
                <span className="font-black text-[#9A6B00]">
                  {formatNumber(pointsCost)} coin
                </span>{" "}
                để đổi{" "}
                <span className="font-black text-[#241F3D]">
                  “{rewardTitle}”
                </span>
                .
              </p>

              <div className="mt-4 grid gap-3">
                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#9A6B00]">
                    Họ tên nhận quà
                  </span>
                  <input
                    value={form.recipientName}
                    onChange={(event) =>
                      updateForm("recipientName", event.target.value)
                    }
                    className="mt-1.5 h-11 w-full rounded-2xl border border-[#FFE7A8] bg-white/80 px-3 text-[13px] font-semibold text-[#241F3D] outline-none focus:border-[#FFB703] focus:ring-4 focus:ring-[#FFF0B8]"
                    placeholder="Nguyễn Minh Thúy"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#9A6B00]">
                    Số điện thoại
                  </span>
                  <input
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-2xl border border-[#FFE7A8] bg-white/80 px-3 text-[13px] font-semibold text-[#241F3D] outline-none focus:border-[#FFB703] focus:ring-4 focus:ring-[#FFF0B8]"
                    placeholder="0812467168"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#9A6B00]">
                    Địa chỉ nhận quà
                  </span>
                  <textarea
                    value={form.address}
                    onChange={(event) =>
                      updateForm("address", event.target.value)
                    }
                    className="mt-1.5 min-h-[76px] w-full resize-none rounded-2xl border border-[#FFE7A8] bg-white/80 px-3 py-2 text-[13px] font-semibold leading-6 text-[#241F3D] outline-none focus:border-[#FFB703] focus:ring-4 focus:ring-[#FFF0B8]"
                    placeholder="Nhập địa chỉ nhận quà..."
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#9A6B00]">
                    Ghi chú
                  </span>
                  <textarea
                    value={form.note}
                    onChange={(event) => updateForm("note", event.target.value)}
                    className="mt-1.5 min-h-[66px] w-full resize-none rounded-2xl border border-[#FFE7A8] bg-white/80 px-3 py-2 text-[13px] font-semibold leading-6 text-[#241F3D] outline-none focus:border-[#FFB703] focus:ring-4 focus:ring-[#FFF0B8]"
                    placeholder="Ghi chú thêm nếu có..."
                  />
                </label>
              </div>

              <div className="mt-3 grid gap-2 rounded-2xl border border-[#FFE7A8] bg-white/70 p-3 text-[12px] font-bold text-[#615C7A]">
                <div className="flex items-center justify-between gap-3">
                  <span>Coin hiện có</span>
                  <span className="font-black text-[#241F3D]">
                    {formatNumber(currentBalance)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Chi phí đổi quà</span>
                  <span className="font-black text-[#B77900]">
                    -{formatNumber(pointsCost)}
                  </span>
                </div>

                <div className="h-px bg-[#FFE7A8]" />

                <div className="flex items-center justify-between gap-3">
                  <span>Sau khi đổi</span>
                  <span className="font-black text-[#23965F]">
                    {formatNumber(Math.max(0, currentBalance - pointsCost))}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void handleRedeem()}
                  disabled={isLoading}
                  className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-2xl bg-[#1A152E] px-4 text-[12px] font-black text-white shadow-[0_12px_24px_rgba(26,21,46,0.14)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Coins className="h-4 w-4" />
                  )}
                  Xác nhận đổi
                </button>

                <button
                  type="button"
                  onClick={closeConfirm}
                  disabled={isLoading}
                  className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[12px] font-black text-[#5F5A77] transition hover:bg-[#FAF9FF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Huỷ
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {message ? (
        <div
          className={`mt-3 flex items-start gap-2 rounded-2xl px-3 py-3 text-[12px] font-semibold leading-5 ${
            isError
              ? "border border-[#FFD8D8] bg-[#FFF7F7] text-[#B42318]"
              : "border border-[#DDF5E7] bg-[#F1FFF7] text-[#23965F]"
          }`}
        >
          {isError ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          )}

          <div>
            <div>{message}</div>

            {nextBalance !== null ? (
              <div className="mt-1 text-[11px] font-black">
                Coin còn lại: {formatNumber(nextBalance)}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}