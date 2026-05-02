import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type EnergyCheckinBody = {
  score?: number;
  note?: string;
};

type EnergyCheckinRow = {
  id: string;
  userId: string;
  score: number;
  note: string | null;
  source: string;
  checkedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Bạn cần đăng nhập." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: "Không tìm thấy tài khoản." }, { status: 404 });
    }

    const body = (await request.json()) as EnergyCheckinBody;
    const score = Number(body.score);

    if (!Number.isFinite(score) || score < 0 || score > 100) {
      return NextResponse.json({ message: "Điểm năng lượng phải nằm trong khoảng 0–100." }, { status: 400 });
    }

    const note = String(body.note || "").trim();
    const checkinId = randomUUID();

    await prisma.$executeRaw`
      INSERT INTO EnergyCheckin (
        id,
        userId,
        score,
        note,
        source,
        checkedAt,
        createdAt,
        updatedAt
      )
      VALUES (
        ${checkinId},
        ${user.id},
        ${Math.round(score)},
        ${note || null},
        'MANUAL',
        NOW(),
        NOW(),
        NOW()
      )
    `;

    const rows = await prisma.$queryRaw<EnergyCheckinRow[]>`
      SELECT id, userId, score, note, source, checkedAt, createdAt, updatedAt
      FROM EnergyCheckin
      WHERE id = ${checkinId}
      LIMIT 1
    `;

    return NextResponse.json({ checkin: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Energy checkin error:", error);
    return NextResponse.json({ message: "Không thể lưu check-in năng lượng." }, { status: 500 });
  }
}