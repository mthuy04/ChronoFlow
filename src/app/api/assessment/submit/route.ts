import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

const assessmentSchema = z.object({
  lionScore: z.number().int().min(0),
  bearScore: z.number().int().min(0),
  wolfScore: z.number().int().min(0),
  dolphinScore: z.number().int().min(0),
});

function getWinningChronotype(scores: {
  lionScore: number;
  bearScore: number;
  wolfScore: number;
  dolphinScore: number;
}) {
  const entries = [
    { type: "Lion", score: scores.lionScore },
    { type: "Bear", score: scores.bearScore },
    { type: "Wolf", score: scores.wolfScore },
    { type: "Dolphin", score: scores.dolphinScore },
  ];

  entries.sort((a, b) => b.score - a.score);
  return entries[0].type;
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
    const parsed = assessmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid assessment payload." },
        { status: 400 }
      );
    }

    const { lionScore, bearScore, wolfScore, dolphinScore } = parsed.data;
    const chronotype = getWinningChronotype(parsed.data);

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { chronotype },
      });

      return tx.chronotypeResult.create({
        data: {
          userId: session.user.id,
          chronotype,
          lionScore,
          bearScore,
          wolfScore,
          dolphinScore,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Assessment submitted successfully.",
      chronotype,
      resultId: result.id,
    });
  } catch (error) {
    console.error("ASSESSMENT_SUBMIT_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}