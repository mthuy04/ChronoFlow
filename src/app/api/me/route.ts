import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        chronotype: true,
        hasCompletedAssessment: true,
        lastAssessmentAt: true,
        coinBalance: true,
        image: true,
        studentId: true,
        targetSleepTime: true,
        targetWakeTime: true,
        customerType: true,
        sourceChannel: true,
        sourceCampaign: true,
        sourceMedium: true,
        sourceContent: true,
        sourceTerm: true,
        companyName: true,
        roleInCompany: true,
        teamSize: true,
        consentForResearch: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      chronotype: user.chronotype,
      hasCompletedAssessment: user.hasCompletedAssessment,
      lastAssessmentAt: user.lastAssessmentAt,
      coinBalance: user.coinBalance,
      image: user.image,
    });
  } catch (error) {
    console.error("GET_ME_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể tải thông tin người dùng.",
      },
      { status: 500 }
    );
  }
}
