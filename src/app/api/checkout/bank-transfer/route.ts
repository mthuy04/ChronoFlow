import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getCheckoutItem } from "@/lib/pricing";
import { createTransferCode, createVietQrUrl } from "@/lib/bank";
import { prisma } from "@/lib/prisma";

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

    const transferCode = createTransferCode(item.key);

    const qrUrl = createVietQrUrl({
      bankId,
      accountNo,
      accountName,
      amount: item.price,
      transferCode,
    });

    const session = await getServerSession(authOptions);
    const user = session?.user?.email
      ? await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
          select: {
            id: true,
          },
        })
      : null;

    const order = await prisma.paymentOrder.create({
      data: {
        userId: user?.id ?? null,
        itemKey: item.key,
        itemName: item.name,
        amount: item.price,
        provider: "SEPAY",
        status: "PENDING",
        transferCode,
        qrUrl,
        bankId,
        accountNo,
        accountName,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      order: {
        orderId: order.id,
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
