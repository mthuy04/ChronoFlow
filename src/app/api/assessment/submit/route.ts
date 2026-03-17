import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateChronotype } from "@/lib/chronotype";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("ASSESSMENT SESSION:", session);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized: no session or email" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("ASSESSMENT BODY:", body);

    const answers = body?.answers;
    console.log("ASSESSMENT ANSWERS:", answers);

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Invalid assessment answers" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        chronotype: true,
      },
    });

    console.log("ASSESSMENT USER:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const { chronotype, scores } = calculateChronotype(answers);
    console.log("ASSESSMENT RESULT:", { chronotype, scores });

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          chronotype,
        },
      }),
      prisma.chronotypeResult.create({
        data: {
          userId: user.id,
          chronotype,
          lionScore: scores.lionScore,
          bearScore: scores.bearScore,
          wolfScore: scores.wolfScore,
          dolphinScore: scores.dolphinScore,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      chronotype,
      scores,
    });
  } catch (error) {
    console.error("ASSESSMENT SUBMIT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to submit assessment",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}