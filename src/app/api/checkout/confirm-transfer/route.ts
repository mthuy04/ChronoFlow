import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      code: "MANUAL_CONFIRM_DISABLED",
      message:
        "Manual transfer confirmation has been disabled. Bank transfers are now confirmed automatically through SePay webhook.",
    },
    { status: 410 },
  );
}