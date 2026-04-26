import Footer from "@/components/layout/Footer";
import DashboardClientUI from "@/components/dashboard/DashboardClientUI";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type ChronotypeKey = "LION" | "BEAR" | "WOLF" | "DOLPHIN";

function normalizeChronotype(value: string | null | undefined): ChronotypeKey {
  const key = String(value || "BEAR").toUpperCase();
  if (key.includes("LION")) return "LION";
  if (key.includes("WOLF")) return "WOLF";
  if (key.includes("DOLPHIN")) return "DOLPHIN";
  return "BEAR";
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseTaskDateKey(scheduledTime: string | null | undefined): string | null {
  const raw = String(scheduledTime || "").trim();
  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const pipeParts = raw.split("|");
  if (pipeParts.length === 3) return pipeParts[0];

  const match = raw.match(/^(\d{4}-\d{2}-\d{2})\s+\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/);
  if (match) return match[1];

  const maybeDate = new Date(raw);
  if (!Number.isNaN(maybeDate.getTime())) {
    return maybeDate.toISOString().slice(0, 10);
  }

  return null;
}

function parseTaskStartTime(scheduledTime: string | null | undefined): string | null {
  const raw = String(scheduledTime || "").trim();
  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const pipeParts = raw.split("|");
  if (pipeParts.length === 3) return pipeParts[1];

  const match = raw.match(/^\d{4}-\d{2}-\d{2}\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
  if (match) return match[1];

  return null;
}

function getPeakWindow(chronotype: ChronotypeKey) {
  switch (chronotype) {
    case "LION":
      return { start: "07:00", end: "10:00", label: "07:00 - 10:00" };
    case "WOLF":
      return { start: "14:30", end: "18:00", label: "14:30 - 18:00" };
    case "DOLPHIN":
      return { start: "10:00", end: "11:30", label: "10:00 - 11:30" };
    case "BEAR":
    default:
      return { start: "09:00", end: "12:00", label: "09:00 - 12:00" };
  }
}

function isInsideWindow(time: string | null, start: string, end: string) {
  if (!time) return false;
  return time >= start && time <= end;
}

function getEnergySeries(chronotype: ChronotypeKey) {
  switch (chronotype) {
    case "LION":
      return [
        { label: "6h", value: 52 },
        { label: "8h", value: 95 },
        { label: "10h", value: 88 },
        { label: "12h", value: 62 },
        { label: "15h", value: 42 },
        { label: "18h", value: 24 },
        { label: "21h", value: 12 },
      ];
    case "WOLF":
      return [
        { label: "6h", value: 12 },
        { label: "8h", value: 22 },
        { label: "10h", value: 38 },
        { label: "12h", value: 56 },
        { label: "15h", value: 82 },
        { label: "18h", value: 96 },
        { label: "21h", value: 80 },
      ];
    case "DOLPHIN":
      return [
        { label: "6h", value: 28 },
        { label: "8h", value: 42 },
        { label: "10h", value: 78 },
        { label: "12h", value: 54 },
        { label: "15h", value: 45 },
        { label: "18h", value: 68 },
        { label: "21h", value: 34 },
      ];
    case "BEAR":
    default:
      return [
        { label: "6h", value: 26 },
        { label: "8h", value: 58 },
        { label: "10h", value: 90 },
        { label: "12h", value: 84 },
        { label: "15h", value: 62 },
        { label: "18h", value: 34 },
        { label: "21h", value: 18 },
      ];
  }
}

function getQuickRescheduleCards(chronotype: ChronotypeKey) {
  switch (chronotype) {
    case "LION":
      return [
        { title: "Deep work", slot: "07:30 - 09:00", note: "Đặt việc khó vào đầu ngày." },
        { title: "Study block", slot: "09:15 - 10:30", note: "Vẫn còn đủ rõ đầu óc để học." },
        { title: "Admin nhẹ", slot: "13:30 - 14:15", note: "Chiều hợp cho xử lý việc nhẹ." },
      ];
    case "WOLF":
      return [
        { title: "Deep work", slot: "15:00 - 16:30", note: "Đây là lúc bạn dễ vào flow hơn." },
        { title: "Creative sprint", slot: "17:00 - 18:00", note: "Hợp cho viết, thiết kế, nghĩ ý tưởng." },
        { title: "Admin nhẹ", slot: "10:00 - 10:45", note: "Sáng nên dành cho việc đơn giản hơn." },
      ];
    case "DOLPHIN":
      return [
        { title: "Focus block", slot: "10:00 - 11:00", note: "Block ngắn, rõ mục tiêu sẽ hợp hơn." },
        { title: "Study block", slot: "11:10 - 11:50", note: "Giữ nhịp ngắn để tránh quá tải." },
        { title: "Routine nhẹ", slot: "16:00 - 16:45", note: "Khung phụ ổn hơn cho task nhẹ." },
      ];
    case "BEAR":
    default:
      return [
        { title: "Deep work", slot: "09:00 - 10:30", note: "Giờ mạnh ổn định nhất trong ngày." },
        { title: "Study block", slot: "10:45 - 11:45", note: "Phù hợp cho học và xử lý nội dung nặng." },
        { title: "Admin nhẹ", slot: "14:00 - 15:00", note: "Đầu chiều hợp cho việc phản hồi." },
      ];
  }
}

function getWeekHeatmap(tasks: Array<{ createdAt: Date; completed: boolean }>) {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return days.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = formatDateKey(date);

    const total = tasks.filter((task) => formatDateKey(task.createdAt) === key).length;
    const completed = tasks.filter(
      (task) => formatDateKey(task.createdAt) === key && task.completed
    ).length;

    return {
      label,
      total,
      completed,
      intensity: Math.min(
        4,
        total === 0 ? 0 : completed >= 3 ? 4 : completed === 2 ? 3 : completed === 1 ? 2 : 1
      ),
    };
  });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <>
        <DashboardClientUI isGuest data={null} isError={false} />
        <Footer />
      </>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      tasks: {
        orderBy: { createdAt: "desc" },
      },
      weeklyInsights: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      chronotypeResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user) {
    return (
      <>
        <DashboardClientUI isGuest={false} data={null} isError />
        <Footer />
      </>
    );
  }

  const chronotype = normalizeChronotype(user.chronotype);
  const peakWindow = getPeakWindow(chronotype);
  const todayKey = formatDateKey(new Date());

  const todayTasks = user.tasks.filter(
    (task) => parseTaskDateKey(task.scheduledTime) === todayKey
  );

  const pendingTasks = user.tasks.filter((task) => !task.completed);
  const completedTasks = user.tasks.filter((task) => task.completed);
  const backlogTasks = user.tasks.filter(
    (task) => String(task.scheduledTime || "").trim().toUpperCase() === "BACKLOG"
  );

  const focusTasks = user.tasks.filter(
    (task) => task.type === "DEEP_WORK" || task.type === "STUDY"
  );

  const alignedTasks = focusTasks.filter((task) =>
    isInsideWindow(parseTaskStartTime(task.scheduledTime), peakWindow.start, peakWindow.end)
  );

  const misalignedTasks = focusTasks.filter((task) =>
    !isInsideWindow(parseTaskStartTime(task.scheduledTime), peakWindow.start, peakWindow.end)
  );

  const latestInsight = user.weeklyInsights[0] ?? null;
  const latestResult = user.chronotypeResults[0] ?? null;

  const focusScore =
    latestInsight?.alignmentScore ??
    (focusTasks.length === 0 ? 0 : Math.round((alignedTasks.length / focusTasks.length) * 100));

  const displayName = user.name?.trim() || "bạn";
  const firstName = displayName.split(" ").slice(-1)[0] || displayName;

  const data = {
    chronotype,
    firstName,
    todayTasks: todayTasks.map((task) => ({
      id: task.id,
      name: task.name,
      type: task.type,
      priority: task.priority,
      duration: task.duration,
      deadline: task.deadline,
      scheduledTime: task.scheduledTime,
      explanation: task.explanation,
      completed: task.completed,
    })),
    pendingTasksCount: pendingTasks.length,
    completedTasksCount: completedTasks.length,
    backlogTasksCount: backlogTasks.length,
    latestInsight: latestInsight
      ? {
          weekLabel: latestInsight.weekLabel,
          alignmentScore: latestInsight.alignmentScore,
          completedCount: latestInsight.completedCount,
          totalCount: latestInsight.totalCount,
          deepWorkCount: latestInsight.deepWorkCount,
          recommendation: latestInsight.recommendation,
          summary: latestInsight.summary,
        }
      : null,
    latestResult: latestResult
      ? {
          lionScore: latestResult.lionScore,
          bearScore: latestResult.bearScore,
          wolfScore: latestResult.wolfScore,
          dolphinScore: latestResult.dolphinScore,
        }
      : null,
    focusScore,
    energySeries: getEnergySeries(chronotype),
    alignedTasks: alignedTasks.slice(0, 4).map((task) => ({
      id: task.id,
      name: task.name,
      scheduledTime: task.scheduledTime,
      duration: task.duration,
    })),
    misalignedTasks: misalignedTasks.slice(0, 4).map((task) => ({
      id: task.id,
      name: task.name,
      scheduledTime: task.scheduledTime,
      duration: task.duration,
    })),
    quickRescheduleCards: getQuickRescheduleCards(chronotype),
    weekHeatmap: getWeekHeatmap(
      user.tasks.map((task) => ({
        createdAt: task.createdAt,
        completed: task.completed,
      }))
    ),
  };

  return (
    <>
      <DashboardClientUI isGuest={false} data={data} isError={false} />
      <Footer />
    </>
  );
}