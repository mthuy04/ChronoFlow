import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type BankWebhookPayload = {
  id?: number | string;
  gateway?: string;
  transactionDate?: string;
  transaction_date?: string;

  amount?: number | string;
  transferAmount?: number | string;
  transfer_amount?: number | string;
  amountIn?: number | string;
  amount_in?: number | string;
  amountOut?: number | string;
  amount_out?: number | string;

  description?: string;
  content?: string;
  transferContent?: string;
  transfer_content?: string;
  code?: string;
  referenceCode?: string;
  reference_code?: string;

  accountNumber?: string;
  account_number?: string;
};

const MAX_TIMESTAMP_DRIFT_SECONDS = 5 * 60;

function normalizeAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[^\d.-]/g, "");
    const parsed = Number(normalized);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function getIncomingAmount(payload: BankWebhookPayload) {
  return (
    normalizeAmount(payload.amount) ??
    normalizeAmount(payload.transferAmount) ??
    normalizeAmount(payload.transfer_amount) ??
    normalizeAmount(payload.amountIn) ??
    normalizeAmount(payload.amount_in) ??
    0
  );
}

function getTransactionContent(payload: BankWebhookPayload) {
  return [
    payload.code,
    payload.description,
    payload.content,
    payload.transferContent,
    payload.transfer_content,
    payload.referenceCode,
    payload.reference_code,
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ");
}

function extractTransferCode(text: string) {
  const match = text.match(/CF[\s_-]+(PLUS|PRO|PLANNER-KIT)[\s_-]+[A-Z0-9]{6}/i);

  if (!match?.[0]) {
    return null;
  }

  return match[0].replace(/[_-]+/g, " ").replace(/\s+/g, " ").toUpperCase();
}

function getSePaySignature(req: NextRequest) {
  return req.headers.get("x-sepay-signature") ?? "";
}

function getSePayTimestamp(req: NextRequest) {
  return req.headers.get("x-sepay-timestamp") ?? "";
}

function stripSignaturePrefix(signature: string) {
  return signature.startsWith("sha256=")
    ? signature.slice("sha256=".length)
    : signature;
}

function safeCompareHex(expectedHex: string, receivedHex: string) {
  const expected = Buffer.from(expectedHex, "hex");
  const received = Buffer.from(receivedHex, "hex");

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

function verifySePaySignature(params: {
  rawBody: string;
  signatureHeader: string;
  timestampHeader: string;
  secret: string;
}) {
  const timestamp = Number(params.timestampHeader);

  if (!Number.isFinite(timestamp)) {
    return {
      ok: false,
      reason: "Missing or invalid X-SePay-Timestamp.",
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const drift = Math.abs(now - timestamp);

  if (drift > MAX_TIMESTAMP_DRIFT_SECONDS) {
    return {
      ok: false,
      reason: "Webhook timestamp is too old or too far in the future.",
    };
  }

  const receivedSignature = stripSignaturePrefix(params.signatureHeader).trim();

  if (!receivedSignature) {
    return {
      ok: false,
      reason: "Missing X-SePay-Signature.",
    };
  }

  const signedPayload = `${params.timestampHeader}.${params.rawBody}`;

  const expectedSignature = crypto
    .createHmac("sha256", params.secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const isValid = safeCompareHex(expectedSignature, receivedSignature);

  return {
    ok: isValid,
    reason: isValid ? null : "Invalid webhook signature.",
  };
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.SEPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[SEPAY_WEBHOOK_ERROR]", "Missing SEPAY_WEBHOOK_SECRET.");

      return NextResponse.json(
        { message: "Server thiếu SEPAY_WEBHOOK_SECRET." },
        { status: 500 },
      );
    }

    const rawBody = await req.text();

    const signatureHeader = getSePaySignature(req);
    const timestampHeader = getSePayTimestamp(req);

    const verification = verifySePaySignature({
      rawBody,
      signatureHeader,
      timestampHeader,
      secret: webhookSecret,
    });

    if (!verification.ok) {
      console.warn("[SEPAY_WEBHOOK_UNAUTHORIZED]", {
        reason: verification.reason,
        hasSignature: Boolean(signatureHeader),
        hasTimestamp: Boolean(timestampHeader),
      });

      return NextResponse.json(
        { message: "Unauthorized webhook." },
        { status: 401 },
      );
    }

    const payload = JSON.parse(rawBody) as BankWebhookPayload;

    const amount = getIncomingAmount(payload);
    const content = getTransactionContent(payload);
    const transferCode = extractTransferCode(content);

    if (!transferCode) {
      console.log("[SEPAY_WEBHOOK_IGNORED]", {
        reason: "Không tìm thấy mã ChronoFlow trong nội dung chuyển khoản.",
        amount,
        content,
        transactionId: payload.id ?? null,
      });

      return NextResponse.json({
        ok: true,
        ignored: true,
        reason: "Không tìm thấy mã ChronoFlow trong nội dung chuyển khoản.",
      });
    }

    /**
     * TODO phase tiếp theo:
     * 1. Tìm PaymentOrder trong DB bằng transferCode.
     * 2. Kiểm tra amount === order.amount.
     * 3. Chống xử lý trùng bằng providerTxnId / SePay transaction id.
     * 4. Update order.status = "PAID", paidAt = new Date().
     * 5. Nếu itemKey = plus/pro -> active subscription.
     * 6. Nếu itemKey = planner-kit -> tạo fulfillment/shipping order.
     * 7. Gửi GA4 purchase server-side hoặc ghi flag đã track.
     */

    console.log("[SEPAY_WEBHOOK_MATCHED]", {
      transferCode,
      amount,
      content,
      transactionId: payload.id ?? null,
      gateway: payload.gateway ?? null,
      transactionDate:
        payload.transactionDate ?? payload.transaction_date ?? null,
      accountNumber: payload.accountNumber ?? payload.account_number ?? null,
    });

    return NextResponse.json({
      ok: true,
      transferCode,
      amount,
    });
  } catch (error) {
    console.error("[SEPAY_WEBHOOK_ERROR]", error);

    return NextResponse.json(
      { message: "Webhook xử lý thất bại." },
      { status: 500 },
    );
  }
}