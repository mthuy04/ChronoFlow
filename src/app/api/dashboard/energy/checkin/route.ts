import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type EnergyCheckinBody = {
  score?: number;
  note?: string;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản." },
        { status: 404 },
      );
    }

    const body = (await request.json().catch(() => null)) as
      | EnergyCheckinBody
      | null;

    const score = Number(body?.score);

    if (!Number.isFinite(score) || score < 0 || score > 100) {
      return NextResponse.json(
        { message: "Điểm năng lượng phải nằm trong khoảng 0–100." },
        { status: 400 },
      );
    }

    const note = String(body?.note || "").trim();

    const checkin = await prisma.energyCheckin.create({
      data: {
        userId: user.id,
        score: Math.round(score),
        note: note || null,
        source: "MANUAL",
        checkedAt: new Date(),
      },
      select: {
        id: true,
        userId: true,
        score: true,
        note: true,
        source: true,
        checkedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ checkin }, { status: 201 });
  } catch (error) {
    console.error("Energy checkin error:", error);

    return NextResponse.json(
      { message: "Không thể lưu check-in năng lượng." },
      { status: 500 },
    );
  }
}