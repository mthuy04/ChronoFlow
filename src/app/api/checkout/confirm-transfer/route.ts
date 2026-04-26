import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const orderId = String(formData.get("orderId") ?? "");
    const proof = formData.get("proof");

    if (!orderId) {
      return NextResponse.json(
        { message: "Thiếu mã đơn hàng." },
        { status: 400 }
      );
    }

    // TODO nếu dùng Supabase/Firebase/S3:
    // 1. upload proof image lên storage
    // 2. lấy proofImageUrl
    // 3. update order:
    // status: "pending_review"
    // proofImageUrl
    // confirmedByUserAt: new Date()

    console.log("User confirmed transfer:", {
      orderId,
      hasProof: proof instanceof File,
      proofName: proof instanceof File ? proof.name : null,
    });

    return NextResponse.json({
      ok: true,
      message: "Đã gửi xác nhận chuyển khoản.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Không gửi được xác nhận chuyển khoản." },
      { status: 500 }
    );
  }
}