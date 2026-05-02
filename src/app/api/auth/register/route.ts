import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
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

const registerSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Email is invalid."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  studentId: z.string().optional(),

  customerType: z.enum(CUSTOMER_TYPES).optional(),
  sourceChannel: z.enum(SOURCE_CHANNELS).optional(),
  sourceCampaign: z.string().optional(),
  sourceMedium: z.string().optional(),
  sourceContent: z.string().optional(),
  sourceTerm: z.string().optional(),

  companyName: z.string().optional(),
  roleInCompany: z.string().optional(),
  teamSize: z.number().int().min(0).max(100000).optional(),
  consentForResearch: z.boolean().optional(),
});

function normalizeOptionalString(value: string | undefined) {
  const normalized = String(value || "").trim();
  return normalized || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Thông tin đăng ký chưa hợp lệ.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      password,
      studentId,
      customerType,
      sourceChannel,
      sourceCampaign,
      sourceMedium,
      sourceContent,
      sourceTerm,
      companyName,
      roleInCompany,
      teamSize,
      consentForResearch,
    } = parsed.data;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email này đã được đăng ký." },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        studentId: normalizeOptionalString(studentId),
        role: "USER",

        customerType: customerType ?? null,
        sourceChannel: sourceChannel ?? null,
        sourceCampaign: normalizeOptionalString(sourceCampaign),
        sourceMedium: normalizeOptionalString(sourceMedium),
        sourceContent: normalizeOptionalString(sourceContent),
        sourceTerm: normalizeOptionalString(sourceTerm),
        companyName: normalizeOptionalString(companyName),
        roleInCompany: normalizeOptionalString(roleInCompany),
        teamSize: typeof teamSize === "number" ? teamSize : null,
        consentForResearch: consentForResearch ?? false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        customerType: true,
        sourceChannel: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tạo tài khoản thành công.",
      user,
    });
  } catch (error) {
    console.error("REGISTER_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể tạo tài khoản. Vui lòng thử lại.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}