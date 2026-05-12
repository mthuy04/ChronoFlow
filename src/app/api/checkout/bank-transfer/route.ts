import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { createTransferCode, createVietQrUrl } from "@/lib/bank";
import { getCheckoutItem } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

type CheckoutRequestBody = {
  itemKey?: unknown;
};

type SessionUserForCheckout = {
  id?: string | null;
  email?: string | null;
  role?: string | null;
};

type CreateOrderInput = {
  userId: string;
  itemKey: string;
  itemName: string;
  itemType: string;
  amount: number;
  bankId: string;
  accountNo: string;
  accountName: string;
};

type PaymentOrderForResponse = {
  id: string;
  itemKey: string;
  itemName: string;
  itemType: string;
  amount: number;
  currency: string;
  status: string;
  transferCode: string;
  qrUrl: string | null;
  expiresAt: Date | null;
  createdAt: Date;
};

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

function buildLoginUrl(req: NextRequest) {
  const referer = req.headers.get("referer");

  if (!referer) {
    return "/auth/login?callbackUrl=/checkout";
  }

  try {
    const url = new URL(referer);
    return `/auth/login?callbackUrl=${encodeURIComponent(
      `${url.pathname}${url.search}`,
    )}`;
  } catch {
    return "/auth/login?callbackUrl=/checkout";
  }
}

async function createPaymentOrderWithUniqueCode(
  input: CreateOrderInput,
): Promise<PaymentOrderForResponse> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const transferCode = createTransferCode(input.itemKey);

    const qrUrl = createVietQrUrl({
      bankId: input.bankId,
      accountNo: input.accountNo,
      accountName: input.accountName,
      amount: input.amount,
      transferCode,
    });

    try {
      const order = await prisma.paymentOrder.create({
        data: {
          userId: input.userId,
          itemKey: input.itemKey,
          itemName: input.itemName,
          itemType: input.itemType,
          amount: input.amount,
          currency: "VND",
          provider: "SEPAY",
          status: "PENDING",
          transferCode,
          qrUrl,
          bankId: input.bankId,
          accountNo: input.accountNo,
          accountName: input.accountName,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
        select: {
          id: true,
          itemKey: true,
          itemName: true,
          itemType: true,
          amount: true,
          currency: true,
          status: true,
          transferCode: true,
          qrUrl: true,
          expiresAt: true,
          createdAt: true,
        },
      });

      return order;
    } catch (error) {
      if (isUniqueConstraintError(error) && attempt < maxAttempts) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Không tạo được mã chuyển khoản duy nhất.");
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = (session?.user ?? null) as SessionUserForCheckout | null;

    const sessionUserId =
      typeof sessionUser?.id === "string" && sessionUser.id.trim().length > 0
        ? sessionUser.id.trim()
        : null;

    const sessionEmail =
      typeof sessionUser?.email === "string" &&
      sessionUser.email.trim().length > 0
        ? sessionUser.email.trim()
        : null;

    console.log("[CHECKOUT_SESSION_DEBUG]", {
      hasSession: Boolean(session),
      userId: sessionUserId,
      email: sessionEmail,
      role: sessionUser?.role ?? null,
    });

    if (!sessionUserId && !sessionEmail) {
      return NextResponse.json(
        {
          message: "Bạn cần đăng nhập trước khi thanh toán.",
          loginUrl: buildLoginUrl(req),
        },
        { status: 401 },
      );
    }

    const user = sessionUserId
      ? await prisma.user.findUnique({
          where: {
            id: sessionUserId,
          },
          select: {
            id: true,
            email: true,
          },
        })
      : await prisma.user.findUnique({
          where: {
            email: sessionEmail as string,
          },
          select: {
            id: true,
            email: true,
          },
        });

    if (!user) {
      console.warn("[CHECKOUT_USER_NOT_FOUND]", {
        sessionUserId,
        sessionEmail,
      });

      return NextResponse.json(
        { message: "Không tìm thấy tài khoản người dùng." },
        { status: 404 },
      );
    }

    const body = (await req.json().catch(() => null)) as
      | CheckoutRequestBody
      | null;

    const itemKey = typeof body?.itemKey === "string" ? body.itemKey : null;
    const item = getCheckoutItem(itemKey);

    if (!item) {
      return NextResponse.json(
        { message: "Gói thanh toán không hợp lệ." },
        { status: 400 },
      );
    }

    const bankId = process.env.NEXT_PUBLIC_BANK_ID;
    const accountNo = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO;
    const accountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME;

    if (!bankId || !accountNo || !accountName) {
      console.error("[CHECKOUT_BANK_ENV_MISSING]", {
        hasBankId: Boolean(bankId),
        hasAccountNo: Boolean(accountNo),
        hasAccountName: Boolean(accountName),
      });

      return NextResponse.json(
        { message: "Thiếu thông tin ngân hàng trong biến môi trường." },
        { status: 500 },
      );
    }

    const order = await createPaymentOrderWithUniqueCode({
      userId: user.id,
      itemKey: item.key,
      itemName: item.name,
      itemType: item.type,
      amount: item.price,
      bankId,
      accountNo,
      accountName,
    });

    console.log("[CHECKOUT_PAYMENT_ORDER_CREATED]", {
      orderId: order.id,
      userId: user.id,
      itemKey: order.itemKey,
      amount: order.amount,
      transferCode: order.transferCode,
      status: order.status,
    });

    return NextResponse.json({
      order: {
        orderId: order.id,
        itemKey: order.itemKey,
        itemName: order.itemName,
        itemType: order.itemType,
        status: order.status,
        transferCode: order.transferCode,
        qrUrl: order.qrUrl,
        amount: order.amount,
        currency: order.currency,
        expiresAt: order.expiresAt?.toISOString() ?? null,
        createdAt: order.createdAt.toISOString(),
        bank: {
          bankId,
          accountNo,
          accountName,
        },
      },
    });
  } catch (error) {
    console.error("Create SePay bank transfer order failed:", error);

    return NextResponse.json(
      { message: "Không tạo được QR chuyển khoản." },
      { status: 500 },
    );
  }
}