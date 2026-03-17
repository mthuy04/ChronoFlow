import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateAlignmentScore,
  countDeepWorkTasks,
  generateWeeklyInsight,
} from "@/lib/insights";
import type { Task as AppTask, TaskType as AppTaskType, Priority as AppPriority } from "@/types/task";

function getCurrentWeekLabel(date = new Date()) {
  const year = date.getFullYear();
  const start = new Date(year, 0, 1);
  const diff =
    (date.getTime() - start.getTime() +
      (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000) /
    86400000;
  const week = Math.floor(diff / 7) + 1;
  return `${year}-W${week}`;
}

function mapTaskType(type: string): AppTaskType {
  switch (type) {
    case "DEEP_WORK":
      return "Deep Work";
    case "STUDY":
      return "Study";
    case "CREATIVE":
      return "Creative";
    case "ADMIN":
      return "Admin";
    case "ROUTINE":
      return "Routine";
    case "PERSONAL":
      return "Personal";
    default:
      return "Personal";
  }
}

function mapPriority(priority: string): AppPriority {
  switch (priority) {
    case "HIGH":
      return "High";
    case "MEDIUM":
      return "Medium";
    case "LOW":
      return "Low";
    default:
      return "Medium";
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        chronotype: true,
      },
    });

    if (!user?.chronotype) {
      return NextResponse.json(
        { success: false, message: "No chronotype found for this user." },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const normalizedTasks: AppTask[] = tasks.map((task) => ({
      id: task.id,
      name: task.name,
      type: mapTaskType(task.type),
      priority: mapPriority(task.priority),
      duration: task.duration,
      deadline: task.deadline ?? "No deadline",
      scheduledTime: task.scheduledTime,
      explanation: task.explanation,
      completed: task.completed,
    }));

    const weeklyInsight = generateWeeklyInsight(
      normalizedTasks,
      user.chronotype as "Lion" | "Bear" | "Wolf" | "Dolphin"
    );

    const weekLabel = getCurrentWeekLabel();

    const existingInsight = await prisma.weeklyInsight.findFirst({
      where: {
        userId: session.user.id,
        weekLabel,
      },
    });

    const savedInsight = existingInsight
      ? await prisma.weeklyInsight.update({
          where: { id: existingInsight.id },
          data: {
            alignmentScore: weeklyInsight.alignmentScore,
            completedCount: weeklyInsight.completedCount,
            totalCount: weeklyInsight.totalCount,
            deepWorkCount: weeklyInsight.deepWorkCount,
            recommendation: weeklyInsight.recommendation,
            summary: weeklyInsight.summary,
          },
        })
      : await prisma.weeklyInsight.create({
          data: {
            userId: session.user.id,
            weekLabel,
            alignmentScore: weeklyInsight.alignmentScore,
            completedCount: weeklyInsight.completedCount,
            totalCount: weeklyInsight.totalCount,
            deepWorkCount: weeklyInsight.deepWorkCount,
            recommendation: weeklyInsight.recommendation,
            summary: weeklyInsight.summary,
          },
        });

    return NextResponse.json({
      success: true,
      insight: savedInsight,
      metrics: {
        alignmentScore: calculateAlignmentScore(normalizedTasks),
        deepWorkCount: countDeepWorkTasks(normalizedTasks),
        totalCount: normalizedTasks.length,
        completedCount: normalizedTasks.filter((task) => task.completed).length,
      },
    });
  } catch (error) {
    console.error("INSIGHTS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate insights." },
      { status: 500 }
    );
  }
}