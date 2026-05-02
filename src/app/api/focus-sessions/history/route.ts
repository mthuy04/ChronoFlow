import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type FocusSessionHistoryRow = {
  id: string;
  taskId: string | null;
  durationMinutes: number;
  startedAt: Date;
  endedAt: Date;
  createdAt: Date;
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const url = new URL(req.url);
    const taskId = url.searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task id is required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const rows = await prisma.$queryRaw<FocusSessionHistoryRow[]>`
      SELECT
        "id",
        "taskId",
        "durationMinutes",
        "startedAt",
        "endedAt",
        "createdAt"
      FROM "FocusSession"
      WHERE "userId" = ${user.id}
        AND "taskId" = ${task.id}
      ORDER BY "startedAt" DESC
      LIMIT 5;
    `;

    return NextResponse.json({
      success: true,
      sessions: rows,
    });
  } catch (error) {
    console.error("FOCUS SESSION HISTORY ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load focus session history.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}