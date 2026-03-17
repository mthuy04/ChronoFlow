import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Priority, TaskType } from "@prisma/client";

const createTaskSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(TaskType),
  priority: z.nativeEnum(Priority),
  duration: z.string().min(1),
  deadline: z.string().optional().nullable(),
  scheduledTime: z.string().min(1),
  explanation: z.string().min(1),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("TASKS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tasks." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid task payload." },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    console.error("TASK_CREATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to create task." },
      { status: 500 }
    );
  }
}