import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getExtension(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

function isLocalAvatarPath(imagePath: string | null | undefined) {
  return Boolean(imagePath && imagePath.startsWith("/uploads/avatars/"));
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Không tìm thấy file avatar." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Chỉ hỗ trợ JPG, PNG hoặc WEBP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB." },
        { status: 400 }
      );
    }

    const ext = getExtension(file.type);

    if (!ext) {
      return NextResponse.json(
        { error: "Định dạng ảnh không hợp lệ." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng." },
        { status: 404 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${user.id}-${crypto.randomUUID()}.${ext}`;
    const absoluteFilePath = path.join(uploadDir, filename);

    await writeFile(absoluteFilePath, buffer);

    const publicImagePath = `/uploads/avatars/${filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        image: publicImagePath,
      },
      select: {
        id: true,
        image: true,
      },
    });

    if (isLocalAvatarPath(user.image)) {
      // ĐÃ SỬA DÒNG NÀY: Thêm fallback fallback chuỗi rỗng
      const oldAbsolutePath = path.join(process.cwd(), "public", user.image || "");
      unlink(oldAbsolutePath).catch(() => {
        // ignore delete errors for old file
      });
    }

    return NextResponse.json({
      success: true,
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("AVATAR UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error: "Không thể upload avatar.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}