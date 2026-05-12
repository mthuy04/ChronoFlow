import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { message: "Thiếu mã đơn hàng." },
        { status: 400 },
      );
    }

    const order = await prisma.paymentOrder.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        userId: true,
        itemKey: true,
        itemName: true,
        amount: true,
        currency: true,
        provider: true,
        status: true,
        transferCode: true,
        providerTxnId: true,
        paidAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Không tìm thấy đơn hàng." },
        { status: 404 },
      );
    }

    if (order.userId) {
      const session = await getServerSession(authOptions);

      if (!session?.user?.email) {
        return NextResponse.json(
          { message: "Bạn cần đăng nhập để xem đơn này." },
          { status: 401 },
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
        },
      });

      if (user?.id !== order.userId) {
        return NextResponse.json(
          { message: "Bạn không có quyền xem đơn này." },
          { status: 403 },
        );
      }
    }

    return NextResponse.json({
      order: {
        id: order.id,
        itemKey: order.itemKey,
        itemName: order.itemName,
        amount: order.amount,
        currency: order.currency,
        provider: order.provider,
        status: order.status,
        transferCode: order.transferCode,
        transactionId: order.providerTxnId ?? order.id,
        paidAt: order.paidAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    console.error("[CHECKOUT_ORDER_STATUS_ERROR]", error);

    return NextResponse.json(
      { message: "Không tải được trạng thái đơn hàng." },
      { status: 500 },
    );
  }
}
