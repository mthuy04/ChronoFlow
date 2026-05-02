import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";
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
  name: z.string().trim().max(120).optional().nullable(),
  email: z.string().trim().email().max(180).optional().nullable(),
  rating: z.number().int().min(1).max(5),
  userType: z.enum(CUSTOMER_TYPES).optional().nullable(),
  sourceChannel: z.enum(SOURCE_CHANNELS).optional().nullable(),
  whatWorked: z.string().trim().min(8).max(3000),
  whatConfused: z.string().trim().max(3000).optional().nullable(),
  featureRequest: z.string().trim().max(3000).optional().nullable(),
  wouldRecommend: z.boolean().default(false),
  testimonialConsent: z.boolean().default(false),
  contactConsent: z.boolean().default(false),
});

type FeedbackPayload = z.infer<typeof feedbackSchema>;

type SessionUserRow = {
  id: string;
  name: string | null;
  email: string;
};

type FeedbackEmailData = {
  feedbackId: string;
  submittedAt: Date;
  payload: FeedbackPayload;
  sessionUser: SessionUserRow | null;
};

function normalizeOptionalString(value: string | null | undefined) {
  const normalized = String(value || "").trim();
  return normalized.length > 0 ? normalized : null;
}

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value.trim();
}

function getSmtpConfig() {
  const host = getRequiredEnv("SMTP_HOST");
  const portRaw = getRequiredEnv("SMTP_PORT");
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");
  const receiver = getRequiredEnv("CONTACT_RECEIVER_EMAIL");

  const port = Number(portRaw);

  if (!Number.isFinite(port)) {
    throw new Error("SMTP_PORT must be a valid number.");
  }

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    receiver,
  };
}

function getUserTypeLabel(value: string | null | undefined) {
  const labels: Record<string, string> = {
    STUDENT: "Sinh viên",
    WORKER: "Người đi làm",
    FREELANCER: "Freelancer",
    FOUNDER: "Founder / startup",
    BUSINESS_OWNER: "Chủ kinh doanh",
    COMPANY_EMPLOYEE: "Nhân sự doanh nghiệp",
    OTHER: "Khác",
  };

  return value ? labels[value] ?? value : "Chưa chọn";
}

function getSourceChannelLabel(value: string | null | undefined) {
  const labels: Record<string, string> = {
    FACEBOOK: "Facebook",
    TIKTOK: "TikTok",
    INSTAGRAM: "Instagram",
    FRIEND: "Bạn bè giới thiệu",
    DIRECT_MEETING: "Gặp trực tiếp / demo",
    COMPANY: "Doanh nghiệp / công ty",
    CLASS_GROUP: "Nhóm lớp / cộng đồng học tập",
    OTHER: "Khác",
  };

  return value ? labels[value] ?? value : "Chưa chọn";
}

function formatBoolean(value: boolean) {
  return value ? "Có" : "Không";
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function escapeHtml(value: string | null | undefined) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildPlainTextEmail(data: FeedbackEmailData) {
  const { payload, sessionUser, feedbackId, submittedAt } = data;

  return [
    "ChronoFlow Feedback mới",
    "",
    `Feedback ID: ${feedbackId}`,
    `Thời gian: ${formatDateTime(submittedAt)}`,
    "",
    "Thông tin người gửi",
    `Tên form: ${payload.name || "Không nhập"}`,
    `Email form: ${payload.email || "Không nhập"}`,
    `Tài khoản đăng nhập: ${
      sessionUser
        ? `${sessionUser.name || "Không có tên"} <${sessionUser.email}>`
        : "Không đăng nhập"
    }`,
    "",
    "Thông tin phân loại",
    `Rating: ${payload.rating}/5`,
    `Nhóm người dùng: ${getUserTypeLabel(payload.userType)}`,
    `Nguồn biết đến: ${getSourceChannelLabel(payload.sourceChannel)}`,
    `Sẵn sàng giới thiệu: ${formatBoolean(payload.wouldRecommend)}`,
    `Cho phép dùng testimonial: ${formatBoolean(payload.testimonialConsent)}`,
    `Cho phép liên hệ lại: ${formatBoolean(payload.contactConsent)}`,
    "",
    "Điều hữu ích nhất",
    payload.whatWorked,
    "",
    "Điều còn khó hiểu / chưa thuận tiện",
    payload.whatConfused || "Không có",
    "",
    "Tính năng muốn thêm / cải thiện",
    payload.featureRequest || "Không có",
  ].join("\n");
}

function buildHtmlEmail(data: FeedbackEmailData) {
  const { payload, sessionUser, feedbackId, submittedAt } = data;

  const senderName = payload.name || sessionUser?.name || "Người dùng ChronoFlow";
  const senderEmail = payload.email || sessionUser?.email || "Không có email";

  return `
    <div style="margin:0;padding:0;background:#f4f2fa;font-family:Arial,Helvetica,sans-serif;color:#1a1528;">
      <div style="max-width:720px;margin:0 auto;padding:28px 16px;">
        <div style="border-radius:28px;background:#ffffff;border:1px solid #ebe7ff;overflow:hidden;box-shadow:0 18px 50px rgba(26,21,40,0.08);">
          <div style="padding:28px;background:linear-gradient(135deg,#f2edff,#e9e2ff,#dcecff);">
            <div style="display:inline-block;padding:8px 12px;border-radius:999px;background:#ffffffcc;color:#6f59ff;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;">
              ChronoFlow Feedback
            </div>
            <h1 style="margin:16px 0 8px;font-size:28px;line-height:1.15;color:#1a1528;">
              Feedback mới từ ${escapeHtml(senderName)}
            </h1>
            <p style="margin:0;color:#5b566e;font-size:14px;line-height:1.7;">
              Feedback được gửi từ form /feedback và đã được lưu vào database.
            </p>
          </div>

          <div style="padding:24px;">
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tbody>
                ${buildInfoRow("Feedback ID", feedbackId)}
                ${buildInfoRow("Thời gian", formatDateTime(submittedAt))}
                ${buildInfoRow("Tên form", payload.name || "Không nhập")}
                ${buildInfoRow("Email form", senderEmail)}
                ${buildInfoRow(
                  "Tài khoản đăng nhập",
                  sessionUser
                    ? `${sessionUser.name || "Không có tên"} <${sessionUser.email}>`
                    : "Không đăng nhập",
                )}
                ${buildInfoRow("Rating", `${payload.rating}/5`)}
                ${buildInfoRow("Nhóm người dùng", getUserTypeLabel(payload.userType))}
                ${buildInfoRow(
                  "Nguồn biết đến",
                  getSourceChannelLabel(payload.sourceChannel),
                )}
                ${buildInfoRow(
                  "Sẵn sàng giới thiệu",
                  formatBoolean(payload.wouldRecommend),
                )}
                ${buildInfoRow(
                  "Cho phép testimonial",
                  formatBoolean(payload.testimonialConsent),
                )}
                ${buildInfoRow(
                  "Cho phép liên hệ lại",
                  formatBoolean(payload.contactConsent),
                )}
              </tbody>
            </table>

            ${buildTextBlock("Điều hữu ích nhất", payload.whatWorked)}
            ${buildTextBlock(
              "Điều còn khó hiểu / chưa thuận tiện",
              payload.whatConfused || "Không có",
            )}
            ${buildTextBlock(
              "Tính năng muốn thêm / cải thiện",
              payload.featureRequest || "Không có",
            )}
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildInfoRow(label: string, value: string) {
  return `
    <tr>
      <td style="width:190px;padding:10px 12px;border-bottom:1px solid #eef0f6;color:#8a84a3;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #eef0f6;color:#1a1528;font-size:14px;font-weight:700;">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

function buildTextBlock(title: string, value: string) {
  return `
    <div style="margin-top:18px;padding:18px;border-radius:20px;background:#fafaff;border:1px solid #e9e5ff;">
      <div style="margin-bottom:8px;color:#6f59ff;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;">
        ${escapeHtml(title)}
      </div>
      <div style="white-space:pre-wrap;color:#3f3a52;font-size:14px;line-height:1.75;">
        ${escapeHtml(value)}
      </div>
    </div>
  `;
}

async function sendFeedbackEmail(data: FeedbackEmailData) {
  const smtp = getSmtpConfig();

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  const senderName =
    data.payload.name || data.sessionUser?.name || "ChronoFlow User";
  const senderEmail =
    data.payload.email || data.sessionUser?.email || smtp.user;

  await transporter.sendMail({
    from: `"ChronoFlow Feedback" <${smtp.user}>`,
    to: smtp.receiver,
    replyTo: `"${senderName}" <${senderEmail}>`,
    subject: `ChronoFlow feedback mới · ${data.payload.rating}/5 · ${senderName}`,
    text: buildPlainTextEmail(data),
    html: buildHtmlEmail(data),
  });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    const body = (await request.json().catch(() => null)) as unknown;
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

    const payload = parsed.data;

    let sessionUser: SessionUserRow | null = null;

    if (session?.user?.email) {
      sessionUser = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }

    const feedback = await prisma.feedbackResponse.create({
      data: {
        userId: sessionUser?.id ?? null,
        name: normalizeOptionalString(payload.name),
        email: normalizeOptionalString(payload.email),
        rating: payload.rating,
        userType: payload.userType ?? null,
        sourceChannel: payload.sourceChannel ?? null,
        whatWorked: payload.whatWorked.trim(),
        whatConfused: normalizeOptionalString(payload.whatConfused),
        featureRequest: normalizeOptionalString(payload.featureRequest),
        wouldRecommend: payload.wouldRecommend,
        testimonialConsent: payload.testimonialConsent,
        contactConsent: payload.contactConsent,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    await sendFeedbackEmail({
      feedbackId: feedback.id,
      submittedAt: feedback.createdAt,
      payload,
      sessionUser,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Cảm ơn bạn. Feedback đã được gửi tới ChronoFlow rồi.",
        feedbackId: feedback.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[FEEDBACK_POST]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Không thể gửi feedback lúc này.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}