import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { forbiddenPlanResponse, hasFeatureAccess } from "@/lib/plan-access";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const url = new URL(request.url);
    const taskId = url.searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task id is required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        planTier: true,
        planExpiresAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (!hasFeatureAccess(user, "FOCUS_HISTORY")) {
      return forbiddenPlanResponse("FOCUS_HISTORY");
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

    const sessions = await prisma.focusSession.findMany({
      where: {
        userId: user.id,
        taskId: task.id,
      },
      orderBy: { startedAt: "desc" },
      take: 5,
      select: {
        id: true,
        taskId: true,
        durationMinutes: true,
        startedAt: true,
        endedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      sessions,
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