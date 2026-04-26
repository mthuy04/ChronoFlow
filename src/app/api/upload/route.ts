import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Đảm bảo đường dẫn prisma của bạn đúng
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Đảm bảo đường dẫn auth của bạn đúng

// Cấu hình "chìa khóa" Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // 1. Kiểm tra đăng nhập (Bảo mật cho app)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Bạn cần đăng nhập để đổi ảnh" }, { status: 401 });
    }

    // 2. Lấy file từ FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file ảnh" }, { status: 400 });
    }

    // 3. Chuyển File thành Buffer để upload lên Cloud
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: "chronoflow_avatars",
        transformation: [{ width: 500, height: 500, crop: "fill" }] // Tự động cắt ảnh vuông cho đẹp
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(buffer);
    });

    const imageUrl = (uploadResponse as any).secure_url;

    // 4. Cập nhật link ảnh vào Database Neon của bạn
    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: imageUrl },
    });

    return NextResponse.json({ url: imageUrl, success: true });

  } catch (error) {
    console.error("Lỗi upload Cloudinary:", error);
    return NextResponse.json({ error: "Upload thất bại" }, { status: 500 });
  }
}