import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CustomerType =
  | "STUDENT"
  | "WORKER"
  | "FREELANCER"
  | "FOUNDER"
  | "BUSINESS_OWNER"
  | "COMPANY_EMPLOYEE"
  | "OTHER";

type SourceChannel =
  | "FACEBOOK"
  | "TIKTOK"
  | "INSTAGRAM"
  | "FRIEND"
  | "DIRECT_MEETING"
  | "COMPANY"
  | "CLASS_GROUP"
  | "OTHER";

type SettingsRequestBody = {
  name?: unknown;
  studentId?: unknown;
  targetSleepTime?: unknown;
  targetWakeTime?: unknown;
  customerType?: unknown;
  sourceChannel?: unknown;
  companyName?: unknown;
  roleInCompany?: unknown;
  teamSize?: unknown;
  consentForResearch?: unknown;
};

const CUSTOMER_TYPES: CustomerType[] = [
  "STUDENT",
  "WORKER",
  "FREELANCER",
  "FOUNDER",
  "BUSINESS_OWNER",
  "COMPANY_EMPLOYEE",
  "OTHER",
];

const SOURCE_CHANNELS: SourceChannel[] = [
  "FACEBOOK",
  "TIKTOK",
  "INSTAGRAM",
  "FRIEND",
  "DIRECT_MEETING",
  "COMPANY",
  "CLASS_GROUP",
  "OTHER",
];

function readString(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function readNullableString(value: unknown) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function readNullableCustomerType(value: unknown): CustomerType | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;

  return CUSTOMER_TYPES.includes(value as CustomerType)
    ? (value as CustomerType)
    : null;
}

function readNullableSourceChannel(value: unknown): SourceChannel | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;

  return SOURCE_CHANNELS.includes(value as SourceChannel)
    ? (value as SourceChannel)
    : null;
}

function readNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0 ? Math.round(value) : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : null;
  }

  return null;
}

function readBoolean(value: unknown) {
  return value === true;
}

function isValidTime(value: string | null) {
  if (value === null) return true;
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Bạn cần đăng nhập để cập nhật cài đặt.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json().catch(() => null)) as
      | SettingsRequestBody
      | null;

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu gửi lên không hợp lệ.",
        },
        { status: 400 },
      );
    }

    const name = readString(body.name);
    const studentId = readNullableString(body.studentId);
    const targetSleepTime = readNullableString(body.targetSleepTime);
    const targetWakeTime = readNullableString(body.targetWakeTime);
    const customerType = readNullableCustomerType(body.customerType);
    const sourceChannel = readNullableSourceChannel(body.sourceChannel);
    const companyName = readNullableString(body.companyName);
    const roleInCompany = readNullableString(body.roleInCompany);
    const teamSize = readNullableNumber(body.teamSize);
    const consentForResearch = readBoolean(body.consentForResearch);

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Tên hiển thị không được để trống.",
        },
        { status: 400 },
      );
    }

    if (!isValidTime(targetSleepTime) || !isValidTime(targetWakeTime)) {
      return NextResponse.json(
        {
          success: false,
          message: "Giờ ngủ hoặc giờ thức không đúng định dạng.",
        },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
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
      },
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        targetSleepTime: true,
        targetWakeTime: true,
        customerType: true,
        sourceChannel: true,
        companyName: true,
        roleInCompany: true,
        teamSize: true,
        consentForResearch: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Đã lưu cài đặt thành công.",
      user: updatedUser,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Không thể cập nhật cài đặt lúc này.",
      },
      { status: 500 },
    );
  }
}