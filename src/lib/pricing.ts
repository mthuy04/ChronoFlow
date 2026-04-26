export type CheckoutKey = "plus" | "pro" | "planner-kit";

export const checkoutItems: Record<
  CheckoutKey,
  {
    key: CheckoutKey;
    name: string;
    type: "plan" | "product";
    price: number;
    displayPrice: string;
    description: string;
    trial?: string;
  }
> = {
  plus: {
    key: "plus",
    name: "ChronoFlow Plus",
    type: "plan",
    price: 29000,
    displayPrice: "29.000đ",
    trial: "7 ngày dùng thử",
    description:
      "Weekly insights, lịch sử focus session, gợi ý smart scheduling và coin cap cao hơn.",
  },
  pro: {
    key: "pro",
    name: "ChronoFlow Pro",
    type: "plan",
    price: 59000,
    displayPrice: "59.000đ",
    trial: "7 ngày dùng thử",
    description:
      "Full Chronotype Report, tải PDF và recommendation cá nhân hóa nâng cao.",
  },
  "planner-kit": {
    key: "planner-kit",
    name: "Chrono Planner Kit",
    type: "product",
    price: 199000,
    displayPrice: "199.000đ",
    description:
      "Planner, Energy Cards, Reflection Sheets và sticker ghi chú năng lượng.",
  },
};

export function getCheckoutItem(key: string | null) {
  if (!key) return null;
  return checkoutItems[key as CheckoutKey] ?? null;
}

export function formatVnd(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}