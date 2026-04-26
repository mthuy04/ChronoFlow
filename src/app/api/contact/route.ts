import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const fullName = cleanText(body.fullName);
    const email = cleanText(body.email);
    const phone = cleanText(body.phone);
    const topic = cleanText(body.topic);
    const message = cleanText(body.message);

    if (!fullName || !email || !phone || !topic || !message) {
      return NextResponse.json(
        { ok: false, message: "Vui lòng điền đầy đủ thông tin." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Email không hợp lệ." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

    if (!smtpHost || !smtpUser || !smtpPass || !receiverEmail) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Server chưa cấu hình email. Vui lòng kiểm tra biến môi trường.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const submittedAt = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
    });

    await transporter.sendMail({
      from: `"ChronoFlow Contact" <${smtpUser}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `[ChronoFlow] Yêu cầu hỗ trợ mới - ${topic}`,
      text: `
Bạn có yêu cầu hỗ trợ mới từ website ChronoFlow.

Họ và tên: ${fullName}
Email: ${email}
Số điện thoại: ${phone}
Chủ đề: ${topic}
Thời gian gửi: ${submittedAt}

Nội dung:
${message}
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; background:#f7f5ff; padding:24px;">
          <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; padding:24px; border:1px solid #e9e5ff;">
            <h2 style="margin:0 0 12px; color:#1A1528;">Yêu cầu hỗ trợ mới từ ChronoFlow</h2>
            <p style="margin:0 0 20px; color:#5B566E;">Có người vừa gửi form liên hệ trên website.</p>

            <table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0; color:#8A84A3; font-weight:bold;">Họ và tên</td>
                <td style="padding:10px 0; color:#1A1528;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding:10px 0; color:#8A84A3; font-weight:bold;">Email</td>
                <td style="padding:10px 0; color:#1A1528;">
                  <a href="mailto:${email}" style="color:#6F59FF;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0; color:#8A84A3; font-weight:bold;">Số điện thoại</td>
                <td style="padding:10px 0; color:#1A1528;">
                  <a href="tel:${phone}" style="color:#6F59FF;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0; color:#8A84A3; font-weight:bold;">Chủ đề</td>
                <td style="padding:10px 0; color:#1A1528;">${topic}</td>
              </tr>
              <tr>
                <td style="padding:10px 0; color:#8A84A3; font-weight:bold;">Thời gian</td>
                <td style="padding:10px 0; color:#1A1528;">${submittedAt}</td>
              </tr>
            </table>

            <div style="margin-top:20px; padding:16px; border-radius:16px; background:#f8f9fe; color:#1A1528; line-height:1.6;">
              <strong>Nội dung:</strong>
              <br />
              ${message.replace(/\n/g, "<br />")}
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "Gửi yêu cầu thành công.",
    });
  } catch (error) {
    console.error("CONTACT_FORM_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}