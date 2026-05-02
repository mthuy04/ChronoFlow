import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rewards = [
  {
    slug: "chrono-planner-kit",
    title: "Chrono Planner Kit",
    description:
      "Bộ planner vật lý giúp bạn duy trì nhịp làm việc theo chronotype: weekly planner, habit card và energy map mini.",
    pointsCost: 500,
    imageUrl: "/images/rewards/planner-kit.png",
    category: "PHYSICAL",
    stock: 20,
    perUserLimit: 1,
    active: true,
  },
  {
    slug: "focus-wallpaper-pack",
    title: "Focus Wallpaper Pack",
    description:
      "Bộ hình nền tối giản theo chronotype để nhắc bạn tập trung đúng nhịp mỗi ngày.",
    pointsCost: 120,
    imageUrl: "/images/rewards/wallpaper-pack.png",
    category: "DIGITAL",
    stock: null,
    perUserLimit: 1,
    active: true,
  },
  {
    slug: "deep-work-badge",
    title: "Deep Work Badge",
    description:
      "Huy hiệu thành tựu dành cho người dùng duy trì thói quen focus đều đặn.",
    pointsCost: 220,
    imageUrl: "/images/rewards/deep-work-badge.png",
    category: "DIGITAL",
    stock: null,
    perUserLimit: 1,
    active: true,
  },
];

async function main() {
  for (const reward of rewards) {
    await prisma.rewardItem.upsert({
      where: { slug: reward.slug },
      update: reward,
      create: reward,
    });
  }

  console.log("Seeded reward items.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });