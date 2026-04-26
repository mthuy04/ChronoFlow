import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCheckoutItem } from "@/lib/pricing";

function sortObject(obj: Record<string, string | number>) {
  const sorted: Record<string, string | number> = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = obj[key];
  }

  return sorted;
}

function formatDate(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function getIpAddress(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "127.0.0.1";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = getCheckoutItem(body.itemKey);

    if (!item) {
      return NextResponse.json(
        { message: "Gói thanh toán không hợp lệ." },
        { status: 400 }
      );
    }

    const vnpUrl = process.env.VNPAY_PAYMENT_URL;
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const hashSecret = process.env.VNPAY_HASH_SECRET;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    if (!vnpUrl || !tmnCode || !hashSecret || !returnUrl) {
      return NextResponse.json(
        { message: "Thiếu cấu hình VNPAY trong .env.local." },
        { status: 500 }
      );
    }

    const txnRef = `${Date.now()}_${item.key}`;
    const amount = item.price * 100;

    const inputData: Record<string, string | number> = {
      vnp_Version: "2.1.0",
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount,
      vnp_Command: "pay",
      vnp_CreateDate: formatDate(new Date()),
      vnp_CurrCode: "VND",
      vnp_IpAddr: getIpAddress(req),
      vnp_Locale: "vn",
      vnp_OrderInfo: `Thanh toan ChronoFlow ${item.name}`,
      vnp_OrderType: "billpayment",
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: txnRef,
    };

    const sortedData = sortObject(inputData);

    const searchParams = new URLSearchParams();
    Object.entries(sortedData).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    const hashData = searchParams.toString();

    const secureHash = crypto
      .createHmac("sha512", hashSecret)
      .update(hashData, "utf-8")
      .digest("hex");

    searchParams.append("vnp_SecureHash", secureHash);

    const paymentUrl = `${vnpUrl}?${searchParams.toString()}`;

    // Sau này nên lưu order pending vào DB tại đây:
    // orderId, userId, itemKey, amount, txnRef, status: "pending"

    return NextResponse.json({
      paymentUrl,
      txnRef,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Không tạo được thanh toán VNPAY." },
      { status: 500 }
    );
  }
}