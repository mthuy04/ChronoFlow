import { NextRequest, NextResponse } from "next/server";

type BankWebhookPayload = {
  amount?: number;
  description?: string;
  content?: string;
  transferAmount?: number;
  transferContent?: string;
  transactionDate?: string;
};

function extractTransferCode(text: string) {
  const match = text.match(/CF\s+(PLUS|PRO|PLANNER-KIT)\s+[A-Z0-9]{6}/i);
  return match?.[0]?.toUpperCase() ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-webhook-secret");

    if (secret !== process.env.BANK_WEBHOOK_SECRET) {
      return NextResponse.json(
        { message: "Unauthorized webhook." },
        { status: 401 }
      );
    }

    const payload = (await req.json()) as BankWebhookPayload;

    const amount =
      payload.amount ?? payload.transferAmount ?? 0;

    const content =
      payload.description ?? payload.content ?? payload.transferContent ?? "";

    const transferCode = extractTransferCode(content);

    if (!transferCode) {
      return NextResponse.json({
        ok: true,
        ignored: true,
        reason: "Không tìm thấy mã ChronoFlow trong nội dung chuyển khoản.",
      });
    }

    // TODO:
    // 1. tìm order trong DB bằng transferCode
    // 2. kiểm tra amount === order.amount
    // 3. update order status = "paid"
    // 4. nếu itemKey = plus/pro -> active subscription cho user
    // 5. nếu itemKey = planner-kit -> tạo fulfillment/shipping order

    console.log("Bank webhook matched:", {
      transferCode,
      amount,
      content,
    });

    return NextResponse.json({
      ok: true,
      transferCode,
      amount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Webhook xử lý thất bại." },
      { status: 500 }
    );
  }
}