import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CUSTOMER_TYPES = [
  "STUDENT",
  "WORKER",
  "FREELANCER",
  "FOUNDER",
  "BUSINESS_OWNER",
  "COMPANY_EMPLOYEE",
  "OTHER",
] as const;

const SOURCE_CHANNELS = [
  "FACEBOOK",
  "TIKTOK",
  "INSTAGRAM",
  "FRIEND",
  "DIRECT_MEETING",
  "COMPANY",
  "CLASS_GROUP",
  "OTHER",
] as const;

const profileSchema = z.object({
  name: z.string().min(2),
  studentId: z.string().optional().nullable(),
  targetSleepTime: z.string().optional().nullable(),
  targetWakeTime: z.string().optional().nullable(),

  customerType: z.enum(CUSTOMER_TYPES).optional().nullable(),
  sourceChannel: z.enum(SOURCE_CHANNELS).optional().nullable(),
  companyName: z.string().optional().nullable(),
  roleInCompany: z.string().optional().nullable(),
  teamSize: z.number().int().min(0).max(100000).optional().nullable(),
  consentForResearch: z.boolean().optional(),
});

function isValidTime(value: string | null | undefined) {
  if (!value) return true;
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function normalizeOptionalString(value: string | null | undefined) {
  const normalized = String(value || "").trim();
  return normalized || null;
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Thông tin hồ sơ chưa hợp lệ.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      name,
      studentId,
      targetSleepTime,
      targetWakeTime,
      customerType,
      sourceChannel,
      companyName,
      roleInCompany,
      teamSize,
      consentForResearch,
    } = parsed.data;

    const normalizedSleepTime = normalizeOptionalString(targetSleepTime);
    const normalizedWakeTime = normalizeOptionalString(targetWakeTime);

    if (!isValidTime(normalizedSleepTime)) {
      return NextResponse.json(
        { error: "Giờ ngủ mục tiêu không hợp lệ." },
        { status: 400 },
      );
    }

    if (!isValidTime(normalizedWakeTime)) {
      return NextResponse.json(
        { error: "Giờ thức mục tiêu không hợp lệ." },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name.trim(),
        studentId: normalizeOptionalString(studentId),
        targetSleepTime: normalizedSleepTime,
        targetWakeTime: normalizedWakeTime,

        customerType: customerType ?? null,
        sourceChannel: sourceChannel ?? null,
        companyName: normalizeOptionalString(companyName),
        roleInCompany: normalizeOptionalString(roleInCompany),
        teamSize: typeof teamSize === "number" ? teamSize : null,
        consentForResearch: consentForResearch ?? false,
      },
      select: {
        id: true,
        name: true,
        studentId: true,
        targetSleepTime: true,
        targetWakeTime: true,
        customerType: true,
        sourceChannel: true,
        companyName: true,
        roleInCompany: true,
        teamSize: true,
        consentForResearch: true,
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
      { status: 500 },
    );
  }
}