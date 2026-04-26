import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateChronotype,
  type AssessmentAnswers,
} from "@/lib/chronotype";

function isValidAnswers(answers: unknown): answers is AssessmentAnswers {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return false;
  }

  const values = Object.values(answers);

  if (values.length === 0) {
    return false;
  }

  return values.every((value) => typeof value === "string" && value.trim().length > 0);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn chưa đăng nhập.",
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu gửi lên không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const answers = (body as { answers?: unknown }).answers;

    if (!isValidAnswers(answers)) {
      return NextResponse.json(
        {
          success: false,
          error: "Câu trả lời assessment không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        email: true,
        chronotype: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy người dùng.",
        },
        { status: 404 }
      );
    }

    const { chronotype, scores } = calculateChronotype(answers);

    const savedData = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          chronotype,
          hasCompletedAssessment: true,
          lastAssessmentAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          chronotype: true,
          hasCompletedAssessment: true,
          lastAssessmentAt: true,
        },
      });

      const assessmentResult = await tx.chronotypeResult.create({
        data: {
          userId: user.id,
          chronotype,
          lionScore: scores.lionScore,
          bearScore: scores.bearScore,
          wolfScore: scores.wolfScore,
          dolphinScore: scores.dolphinScore,
        },
        select: {
          id: true,
          chronotype: true,
          lionScore: true,
          bearScore: true,
          wolfScore: true,
          dolphinScore: true,
          createdAt: true,
        },
      });

      return {
        user: updatedUser,
        result: assessmentResult,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lưu kết quả assessment thành công.",
        chronotype,
        scores,
        hasCompletedAssessment: true,
        user: savedData.user,
        result: savedData.result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ASSESSMENT_SUBMIT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Không thể lưu kết quả assessment.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}