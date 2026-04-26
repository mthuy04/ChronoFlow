import { NextRequest, NextResponse } from "next/server";
import { getCheckoutItem } from "@/lib/pricing";
import { createTransferCode, createVietQrUrl } from "@/lib/bank";

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

    const bankId = process.env.NEXT_PUBLIC_BANK_ID;
    const accountNo = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO;
    const accountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME;

    if (!bankId || !accountNo || !accountName) {
      return NextResponse.json(
        { message: "Thiếu thông tin ngân hàng trong .env.local." },
        { status: 500 }
      );
    }

    const orderId = `ORD_${Date.now()}`;
    const transferCode = createTransferCode(item.key);

    const qrUrl = createVietQrUrl({
      bankId,
      accountNo,
      accountName,
      amount: item.price,
      transferCode,
    });

    // TODO: lưu order vào DB:
    // id: orderId
    // userId: currentUser.id
    // itemKey: item.key
    // amount: item.price
    // transferCode
    // paymentMethod: "bank_transfer"
    // status: "pending"

    return NextResponse.json({
      order: {
        orderId,
        transferCode,
        qrUrl,
        amount: item.price,
        bank: {
          bankId,
          accountNo,
          accountName,
        },
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Không tạo được QR chuyển khoản." },
      { status: 500 }
    );
  }
}