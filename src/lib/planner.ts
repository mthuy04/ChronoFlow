
export type TaskType =
  | "DEEP_WORK"
  | "STUDY"
  | "CREATIVE"
  | "ADMIN"
  | "ROUTINE"
  | "PERSONAL";

export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type PlannerView = "day" | "week";

export type PlannerTask = {
  id: string;
  name: string;
  type: TaskType;
  priority: Priority;
  duration: string;
  deadline: string | null;
  scheduledTime: string;
  explanation: string;
  completed: boolean;
  isBacklog: boolean;
  scheduledDate: string | null;
  startTime: string | null;
  endTime: string | null;
  focusMode: string | null;
  focusMinutes: number | null;
  orderIndex: number;
  createdAt: string | Date;
};

export type ChronotypeKey = "LION" | "BEAR" | "WOLF" | "DOLPHIN";

export const taskTypeLabel: Record<TaskType, string> = {
  DEEP_WORK: "Deep work",
  STUDY: "Học tập",
  CREATIVE: "Sáng tạo",
  ADMIN: "Admin",
  ROUTINE: "Routine",
  PERSONAL: "Cá nhân",
};

export const priorityLabel: Record<Priority, string> = {
  HIGH: "Cao",
  MEDIUM: "Trung bình",
  LOW: "Thấp",
};

export const taskTypeColor: Record<TaskType, string> = {
  DEEP_WORK: "bg-[#F3F0FF] border-[#D9CEFF] text-[#6F59FF]",
  STUDY: "bg-[#EEF5FF] border-blue-100 text-blue-600",
  CREATIVE: "bg-[#F5F0FF] border-purple-100 text-purple-600",
  ADMIN: "bg-[#F8F9FE] border-slate-200 text-slate-600",
  ROUTINE: "bg-[#F6F7FA] border-gray-200 text-gray-600",
  PERSONAL: "bg-[#FFF2F8] border-pink-100 text-pink-600",
};

export const focusModePresets = {
  DEEP_WORK: [
    { key: "deep_60", label: "Deep Work 60", minutes: 60 },
    { key: "deep_90", label: "Deep Work 90", minutes: 90 },
  ],
  STUDY: [
    { key: "pomodoro_25_5", label: "Pomodoro 25/5", minutes: 25 },
    { key: "pomodoro_50_10", label: "Pomodoro 50/10", minutes: 50 },
  ],
  CREATIVE: [
    { key: "creative_45", label: "Creative Sprint 45", minutes: 45 },
    { key: "creative_60", label: "Flow Block 60", minutes: 60 },
  ],
  ADMIN: [{ key: "admin_30", label: "Quick Admin 30", minutes: 30 }],
  ROUTINE: [{ key: "routine_20", label: "Routine 20", minutes: 20 }],
  PERSONAL: [{ key: "personal_30", label: "Personal 30", minutes: 30 }],
} as const;

export const taskTimeSuggestions: Record<
  ChronotypeKey,
  Record<
    TaskType,
    {
      startTime: string;
      endTime: string;
      scheduledTime: string;
      explanation: string;
      focusMode: string;
      focusMinutes: number;
    }
  >
> = {
  LION: {
    DEEP_WORK: {
      startTime: "07:00",
      endTime: "09:00",
      scheduledTime: "07:00 - 09:00",
      explanation:
        "Buổi sáng là giờ vàng của bạn. Hãy để việc khó vào block này.",
      focusMode: "deep_90",
      focusMinutes: 90,
    },
    STUDY: {
      startTime: "08:00",
      endTime: "10:00",
      scheduledTime: "08:00 - 10:00",
      explanation: "Khung sáng rất hợp để học sâu và hấp thụ nội dung nặng.",
      focusMode: "pomodoro_50_10",
      focusMinutes: 50,
    },
    CREATIVE: {
      startTime: "09:00",
      endTime: "10:30",
      scheduledTime: "09:00 - 10:30",
      explanation: "Sáng muộn vẫn là khung đầu óc rõ cho sáng tạo.",
      focusMode: "creative_45",
      focusMinutes: 45,
    },
    ADMIN: {
      startTime: "13:00",
      endTime: "14:00",
      scheduledTime: "13:00 - 14:00",
      explanation: "Buổi chiều hợp hơn cho email, admin và follow-up.",
      focusMode: "admin_30",
      focusMinutes: 30,
    },
    ROUTINE: {
      startTime: "15:00",
      endTime: "16:00",
      scheduledTime: "15:00 - 16:00",
      explanation: "Routine nên đi vào lúc năng lượng mềm hơn.",
      focusMode: "routine_20",
      focusMinutes: 20,
    },
    PERSONAL: {
      startTime: "19:00",
      endTime: "20:00",
      scheduledTime: "19:00 - 20:00",
      explanation: "Buổi tối nên ưu tiên việc cá nhân nhẹ và phục hồi.",
      focusMode: "personal_30",
      focusMinutes: 30,
    },
  },
  BEAR: {
    DEEP_WORK: {
      startTime: "09:00",
      endTime: "11:00",
      scheduledTime: "09:00 - 11:00",
      explanation: "Khung ổn định nhất để làm việc cần chiều sâu.",
      focusMode: "deep_90",
      focusMinutes: 90,
    },
    STUDY: {
      startTime: "09:30",
      endTime: "11:30",
      scheduledTime: "09:30 - 11:30",
      explanation: "Buổi sáng giữa ngày rất hợp cho học tập tập trung.",
      focusMode: "pomodoro_50_10",
      focusMinutes: 50,
    },
    CREATIVE: {
      startTime: "10:00",
      endTime: "11:30",
      scheduledTime: "10:00 - 11:30",
      explanation: "Sáng vẫn đủ ổn định để làm việc sáng tạo.",
      focusMode: "creative_45",
      focusMinutes: 45,
    },
    ADMIN: {
      startTime: "14:00",
      endTime: "15:00",
      scheduledTime: "14:00 - 15:00",
      explanation: "Đầu chiều hợp hơn cho việc nhẹ và họp.",
      focusMode: "admin_30",
      focusMinutes: 30,
    },
    ROUTINE: {
      startTime: "16:00",
      endTime: "17:00",
      scheduledTime: "16:00 - 17:00",
      explanation: "Task lặp lại nên đi cuối chiều để giữ block đẹp cho việc khó.",
      focusMode: "routine_20",
      focusMinutes: 20,
    },
    PERSONAL: {
      startTime: "19:00",
      endTime: "20:00",
      scheduledTime: "19:00 - 20:00",
      explanation: "Buổi tối phù hợp cho việc cá nhân hoặc sinh hoạt nhẹ.",
      focusMode: "personal_30",
      focusMinutes: 30,
    },
  },
  WOLF: {
    DEEP_WORK: {
      startTime: "19:00",
      endTime: "21:00",
      scheduledTime: "19:00 - 21:00",
      explanation: "Chiều tối là lúc bạn lên nhịp tốt hơn cho việc khó.",
      focusMode: "deep_90",
      focusMinutes: 90,
    },
    STUDY: {
      startTime: "18:30",
      endTime: "20:30",
      scheduledTime: "18:30 - 20:30",
      explanation: "Khung muộn hơn sẽ hợp cho học tập hơn là sáng sớm.",
      focusMode: "pomodoro_50_10",
      focusMinutes: 50,
    },
    CREATIVE: {
      startTime: "20:00",
      endTime: "21:30",
      scheduledTime: "20:00 - 21:30",
      explanation: "Sáng tạo thường bùng tốt hơn vào cuối ngày với nhịp của bạn.",
      focusMode: "creative_60",
      focusMinutes: 60,
    },
    ADMIN: {
      startTime: "09:00",
      endTime: "10:00",
      scheduledTime: "09:00 - 10:00",
      explanation: "Buổi sáng nên dành cho việc nhẹ, setup và email.",
      focusMode: "admin_30",
      focusMinutes: 30,
    },
    ROUTINE: {
      startTime: "11:00",
      endTime: "12:00",
      scheduledTime: "11:00 - 12:00",
      explanation: "Routine nên đi trước khi vào khung mạnh cuối ngày.",
      focusMode: "routine_20",
      focusMinutes: 20,
    },
    PERSONAL: {
      startTime: "22:00",
      endTime: "23:00",
      scheduledTime: "22:00 - 23:00",
      explanation: "Giữ việc cá nhân nhẹ sau block chính, nhưng đừng quá khuya.",
      focusMode: "personal_30",
      focusMinutes: 30,
    },
  },
  DOLPHIN: {
    DEEP_WORK: {
      startTime: "10:00",
      endTime: "11:30",
      scheduledTime: "10:00 - 11:30",
      explanation: "Dùng khung đầu óc rõ nhất cho deep work, ưu tiên block ngắn.",
      focusMode: "deep_60",
      focusMinutes: 60,
    },
    STUDY: {
      startTime: "10:30",
      endTime: "12:00",
      scheduledTime: "10:30 - 12:00",
      explanation: "Học theo block ngắn sẽ bền hơn lịch quá cứng.",
      focusMode: "pomodoro_25_5",
      focusMinutes: 25,
    },
    CREATIVE: {
      startTime: "16:30",
      endTime: "18:00",
      scheduledTime: "16:30 - 18:00",
      explanation: "Chiều muộn có thể phù hợp hơn nếu sáng chưa thật ổn định.",
      focusMode: "creative_45",
      focusMinutes: 45,
    },
    ADMIN: {
      startTime: "13:30",
      endTime: "14:30",
      scheduledTime: "13:30 - 14:30",
      explanation: "Việc nhẹ nên gom vào khung mềm hơn để bảo vệ focus block.",
      focusMode: "admin_30",
      focusMinutes: 30,
    },
    ROUTINE: {
      startTime: "15:00",
      endTime: "16:00",
      scheduledTime: "15:00 - 16:00",
      explanation: "Routine hợp với block ngắn và rõ ràng hơn.",
      focusMode: "routine_20",
      focusMinutes: 20,
    },
    PERSONAL: {
      startTime: "19:00",
      endTime: "20:00",
      scheduledTime: "19:00 - 20:00",
      explanation: "Buổi tối nên ưu tiên môi trường dịu và nhịp nhẹ hơn.",
      focusMode: "personal_30",
      focusMinutes: 30,
    },
  },
};

export function getSuggestion(chronotype: ChronotypeKey, type: TaskType) {
  return taskTimeSuggestions[chronotype][type];
}

export function getMinutesFromHHMM(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export function getDurationMinutes(start: string, end: string) {
  return getMinutesFromHHMM(end) - getMinutesFromHHMM(start);
}

export function buildTimeLabel(start: string, end: string) {
  return `${start} - ${end}`;
}

export function calcOverloadWarning(tasks: PlannerTask[]) {
  const scheduled = tasks.filter(
    (task) => !task.isBacklog && !task.completed && task.startTime && task.endTime
  );

  const totalMinutes = scheduled.reduce((sum, task) => {
    if (!task.startTime || !task.endTime) return sum;
    return sum + getDurationMinutes(task.startTime, task.endTime);
  }, 0);

  const deepWorkCount = scheduled.filter((task) => task.type === "DEEP_WORK").length;
  const recoveryCount = scheduled.filter((task) => task.type === "PERSONAL").length;

  const warnings: string[] = [];

  if (totalMinutes >= 8 * 60) {
    warnings.push("Lịch hôm nay đang khá dày, nên cân nhắc bỏ bớt hoặc dời task.");
  }

  if (deepWorkCount >= 3) {
    warnings.push("Bạn đang có nhiều block deep work trong cùng một ngày.");
  }

  if (recoveryCount === 0 && totalMinutes >= 5 * 60) {
    warnings.push("Ngày này thiếu block hồi phục hoặc khoảng đệm.");
  }

  return warnings;
}

export function calcFocusScore(tasks: PlannerTask[]) {
  const scheduled = tasks.filter((task) => !task.isBacklog && !task.completed);
  if (scheduled.length === 0) return 0;

  let score = 100;

  const highPriorityLate = scheduled.filter(
    (task) =>
      task.priority === "HIGH" &&
      task.startTime &&
      getMinutesFromHHMM(task.startTime) >= 16 * 60
  ).length;

  const adminInPrime = scheduled.filter(
    (task) =>
      task.type === "ADMIN" &&
      task.startTime &&
      getMinutesFromHHMM(task.startTime) <= 11 * 60
  ).length;

  if (highPriorityLate > 0) score -= highPriorityLate * 10;
  if (adminInPrime > 0) score -= adminInPrime * 8;
  if (scheduled.length > 6) score -= 10;

  return Math.max(score, 20);
}

export function getWeekDates(baseDate: Date) {
  const date = new Date(baseDate);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date);
    d.setDate(date.getDate() + i);
    return d;
  });
}

export function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
import type { Chronotype } from "@/types/chronotype";

export function getChronotypeWindows(chronotype: Chronotype | string | null) {
  const key = String(chronotype || "BEAR").toUpperCase();

  if (key.includes("LION") || key.includes("SƯ")) {
    return {
      deepWork: ["07:00", "10:00"],
      lightWork: ["13:00", "16:00"],
      recovery: ["19:00", "21:00"],
    };
  }

  if (key.includes("WOLF") || key.includes("SÓI")) {
    return {
      deepWork: ["19:00", "22:00"],
      lightWork: ["09:00", "12:00"],
      recovery: ["22:00", "23:30"],
    };
  }

  if (key.includes("DOLPHIN") || key.includes("CÁ")) {
    return {
      deepWork: ["10:00", "11:30"],
      lightWork: ["13:30", "15:00"],
      recovery: ["19:00", "20:30"],
    };
  }

  return {
    deepWork: ["09:00", "12:00"],
    lightWork: ["14:00", "16:00"],
    recovery: ["19:00", "21:00"],
  };
}
