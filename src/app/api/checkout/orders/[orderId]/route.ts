import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

function serializeOrder(order: {
  id: string;
  itemKey: string;
  itemName: string;
  itemType: string;
  amount: number;
  currency: string;
  status: string;
  transferCode: string;
  qrUrl: string | null;
  paidAmount: number | null;
  paidAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  bankId: string | null;
  accountNo: string | null;
  accountName: string | null;
}) {
  return {
    orderId: order.id,
    itemKey: order.itemKey,
    itemName: order.itemName,
    itemType: order.itemType,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    transferCode: order.transferCode,
    qrUrl: order.qrUrl,
    paidAmount: order.paidAmount,
    paidAt: order.paidAt?.toISOString() ?? null,
    expiresAt: order.expiresAt?.toISOString() ?? null,
    createdAt: order.createdAt.toISOString(),
    bank: {
      bankId: order.bankId ?? "",
      accountNo: order.accountNo ?? "",
      accountName: order.accountName ?? "",
    },
  };
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { orderId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để xem trạng thái thanh toán." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản người dùng." },
        { status: 404 },
      );
    }

    const existingOrder = await prisma.paymentOrder.findFirst({
      where: {
        id: orderId,
        userId: user.id,
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
        paidAmount: true,
        paidAt: true,
        expiresAt: true,
        createdAt: true,
        bankId: true,
        accountNo: true,
        accountName: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { message: "Không tìm thấy đơn thanh toán." },
        { status: 404 },
      );
    }

    const shouldExpire =
      existingOrder.status === "PENDING" &&
      existingOrder.expiresAt !== null &&
      existingOrder.expiresAt.getTime() < Date.now();

    if (!shouldExpire) {
      return NextResponse.json({
        order: serializeOrder(existingOrder),
      });
    }

    const expiredOrder = await prisma.paymentOrder.update({
      where: { id: existingOrder.id },
      data: { status: "EXPIRED" },
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
        paidAmount: true,
        paidAt: true,
        expiresAt: true,
        createdAt: true,
        bankId: true,
        accountNo: true,
        accountName: true,
      },
    });

    return NextResponse.json({
      order: serializeOrder(expiredOrder),
    });
  } catch (error) {
    console.error("Read checkout order failed:", error);

    return NextResponse.json(
      { message: "Không đọc được trạng thái thanh toán." },
      { status: 500 },
    );
  }
}