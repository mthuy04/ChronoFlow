"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { ChronotypeKey, getSuggestion, TaskType, Priority } from "@/lib/planner";

export default function AddTaskCard({
  chronotypeKey,
  selectedDate,
  onCreateTask,
}: {
  chronotypeKey: ChronotypeKey;
  selectedDate: string;
  onCreateTask: (payload: {
    name: string;
    type: TaskType;
    priority: Priority;
    duration: string;
    deadline?: string | null;
    scheduledDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    scheduledTime: string;
    explanation: string;
    focusMode?: string | null;
    focusMinutes?: number | null;
    isBacklog?: boolean;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<TaskType>("DEEP_WORK");
  const [priority, setPriority] = useState<Priority>("HIGH");
  const [duration, setDuration] = useState("90 phút");
  const [deadline, setDeadline] = useState("");
  const [scheduledDate, setScheduledDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [explanation, setExplanation] = useState("");
  const [focusMode, setFocusMode] = useState("");
  const [focusMinutes, setFocusMinutes] = useState<number | null>(null);
  const [isBacklog, setIsBacklog] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applySuggestion = (nextType: TaskType) => {
    const suggestion = getSuggestion(chronotypeKey, nextType);
    setStartTime(suggestion.startTime);
    setEndTime(suggestion.endTime);
    setScheduledTime(suggestion.scheduledTime);
    setFocusMode(suggestion.focusMode);
    setFocusMinutes(suggestion.focusMinutes);
    setExplanation((prev) => (prev.trim() ? prev : suggestion.explanation));
  };

  useEffect(() => {
    setScheduledDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    applySuggestion(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Vui lòng nhập tên task.");
      return;
    }

    if (!isBacklog && (!scheduledDate || !startTime || !endTime)) {
      setFormError("Vui lòng chọn ngày, giờ bắt đầu và giờ kết thúc.");
      return;
    }

    if (!explanation.trim()) {
      setFormError("Vui lòng nhập ghi chú / lý do cho task.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateTask({
        name: name.trim(),
        type,
        priority,
        duration,
        deadline: deadline || null,
        scheduledDate: isBacklog ? null : scheduledDate,
        startTime: isBacklog ? null : startTime,
        endTime: isBacklog ? null : endTime,
        scheduledTime: isBacklog ? "Backlog" : `${startTime} - ${endTime}`,
        explanation,
        focusMode: focusMode || null,
        focusMinutes,
        isBacklog,
      });

      setName("");
      setPriority("HIGH");
      setDeadline("");
      setExplanation("");
      setIsBacklog(false);
      applySuggestion(type);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Không thể tạo task."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[30px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(111,89,255,0.10)] backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A84A3]">
            Chỗ quan trọng nhất
          </div>
          <div className="text-[18px] font-[900] text-[#1A1528]">
            Thêm task vào planner
          </div>
        </div>
        <div className="rounded-full bg-[#F3F0FF] px-2.5 py-1 text-[10px] font-bold text-[#6F59FF]">
          Add task
        </div>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input label="Tên task" value={name} onChange={setName} placeholder="Ví dụ: Viết báo cáo BA" />

        <div className="grid gap-3 md:grid-cols-2">
          <Select
            label="Loại task"
            value={type}
            onChange={(value) => {
              const next = value as TaskType;
              setType(next);
              applySuggestion(next);
            }}
            options={[
              { value: "DEEP_WORK", label: "Deep work" },
              { value: "STUDY", label: "Học tập" },
              { value: "CREATIVE", label: "Sáng tạo" },
              { value: "ADMIN", label: "Admin" },
              { value: "ROUTINE", label: "Routine" },
              { value: "PERSONAL", label: "Cá nhân" },
            ]}
          />
          <Select
            label="Ưu tiên"
            value={priority}
            onChange={(value) => setPriority(value as Priority)}
            options={[
              { value: "HIGH", label: "Cao" },
              { value: "MEDIUM", label: "Trung bình" },
              { value: "LOW", label: "Thấp" },
            ]}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Input label="Ngày" value={scheduledDate} onChange={setScheduledDate} placeholder="YYYY-MM-DD" />
          <Input label="Thời lượng" value={duration} onChange={setDuration} placeholder="90 phút" />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Input label="Bắt đầu" value={startTime} onChange={setStartTime} placeholder="09:00" />
          <Input label="Kết thúc" value={endTime} onChange={setEndTime} placeholder="10:30" />
        </div>

        <div className="rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] px-4 py-3 text-[13px] text-[#6B6287]">
          Gợi ý theo chronotype: <span className="font-bold text-[#1A1528]">{scheduledTime}</span>
        </div>

        <Input
          label="Deadline (không bắt buộc)"
          value={deadline}
          onChange={setDeadline}
          placeholder="Ví dụ: 2026-05-01"
        />

        <Textarea
          label="Giải thích / ghi chú"
          value={explanation}
          onChange={setExplanation}
          placeholder="Vì sao task này nên nằm ở khung giờ này?"
        />

        <label className="flex items-center gap-3 rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] px-4 py-3">
          <input
            type="checkbox"
            checked={isBacklog}
            onChange={(e) => setIsBacklog(e.target.checked)}
          />
          <span className="text-[13px] text-[#4F4A68]">
            Đưa task vào backlog thay vì xếp ngay lên lịch
          </span>
        </label>

        {formError && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(108,92,255,0.22)] transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {isSubmitting ? "Đang thêm task..." : "Thêm task"}
        </button>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-bold text-[#6B6287]">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] px-4 py-3 text-[14px] outline-none transition focus:border-[#6F59FF]"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-bold text-[#6B6287]">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] px-4 py-3 text-[14px] outline-none transition focus:border-[#6F59FF]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-bold text-[#6B6287]">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] px-4 py-3 text-[14px] outline-none transition focus:border-[#6F59FF]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}