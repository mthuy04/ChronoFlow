import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isValidTime(value: string | null | undefined) {
  if (!value) return true;
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const name = String(body?.name || "").trim();
    const studentIdRaw =
      typeof body?.studentId === "string" ? body.studentId.trim() : "";
    const targetSleepTime =
      typeof body?.targetSleepTime === "string" && body.targetSleepTime
        ? body.targetSleepTime
        : null;
    const targetWakeTime =
      typeof body?.targetWakeTime === "string" && body.targetWakeTime
        ? body.targetWakeTime
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Tên không được để trống." },
        { status: 400 }
      );
    }

    if (!isValidTime(targetSleepTime)) {
      return NextResponse.json(
        { error: "Giờ ngủ mục tiêu không hợp lệ." },
        { status: 400 }
      );
    }

    if (!isValidTime(targetWakeTime)) {
      return NextResponse.json(
        { error: "Giờ thức mục tiêu không hợp lệ." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        studentId: studentIdRaw || null,
        targetSleepTime,
        targetWakeTime,
      },
      select: {
        id: true,
        name: true,
        studentId: true,
        targetSleepTime: true,
        targetWakeTime: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("PROFILE PATCH ERROR:", error);

    return NextResponse.json(
      {
        error: "Không thể cập nhật hồ sơ.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}