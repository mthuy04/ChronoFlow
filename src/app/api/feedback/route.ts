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

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  userType: z.enum(CUSTOMER_TYPES).optional().nullable(),
  sourceChannel: z.enum(SOURCE_CHANNELS).optional().nullable(),
  whatWorked: z.string().min(5),
  whatConfused: z.string().optional().nullable(),
  featureRequest: z.string().optional().nullable(),
  wouldRecommend: z.boolean().optional(),
  testimonialConsent: z.boolean().optional(),
  contactConsent: z.boolean().optional(),
});

function normalizeOptionalString(value: string | null | undefined) {
  const normalized = String(value || "").trim();
  return normalized || null;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Thông tin feedback chưa hợp lệ.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const user = session?.user?.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            name: true,
            email: true,
            customerType: true,
            sourceChannel: true,
          },
        })
      : null;

    const data = parsed.data;

    const feedback = await prisma.feedbackResponse.create({
      data: {
        userId: user?.id ?? null,
        name: normalizeOptionalString(data.name) ?? user?.name ?? null,
        email: normalizeOptionalString(data.email) ?? user?.email ?? null,
        rating: data.rating,
        userType: data.userType ?? user?.customerType ?? null,
        sourceChannel: data.sourceChannel ?? user?.sourceChannel ?? null,
        whatWorked: data.whatWorked.trim(),
        whatConfused: normalizeOptionalString(data.whatConfused),
        featureRequest: normalizeOptionalString(data.featureRequest),
        wouldRecommend: data.wouldRecommend ?? false,
        testimonialConsent: data.testimonialConsent ?? false,
        contactConsent: data.contactConsent ?? false,
      },
      select: {
        id: true,
        rating: true,
        userType: true,
        sourceChannel: true,
        testimonialConsent: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cảm ơn bạn đã gửi feedback cho ChronoFlow.",
      feedback,
    });
  } catch (error) {
    console.error("FEEDBACK_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Không thể gửi feedback.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}