"use client";

import { Check, Play, Trash2 } from "lucide-react";
import type { Task } from "@/types/task";
import { formatDateLabel } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onDelete,
}: TaskCardProps) {
  return (
    <div
      className={`bg-white rounded-[2rem] border border-[#F0EBE1] shadow-sm p-6 flex justify-between gap-5 transition-all ${
        task.completed ? "opacity-55" : ""
      }`}
    >
      <div className="flex gap-4 flex-1">
        <div className="flex flex-col items-center pt-1">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
              task.completed
                ? "bg-[#3A3836] border-[#3A3836]"
                : "border-[#EAE6DF] hover:border-[#D4B59E]"
            }`}
          >
            {task.completed && <Check className="w-4 h-4 text-white" />}
          </button>
          <div className="w-px h-10 bg-[#F0EBE1] mt-2" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-[#D4B59E] font-bold">
              {task.scheduledTime}
            </span>

            <span
              className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                task.priority === "High"
                  ? "bg-rose-50 text-rose-600"
                  : task.priority === "Medium"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              {task.priority}
            </span>

            <span className="text-[10px] uppercase tracking-widest text-[#A39C93] font-bold">
              {task.duration}
            </span>
          </div>

          <h3
            className={`text-2xl font-serif ${
              task.completed ? "line-through" : ""
            }`}
          >
            {task.name}
          </h3>

          <p className="text-[#8C7A6B] text-sm font-light italic mt-2 leading-relaxed">
            {task.explanation}
          </p>

          <p className="text-[#A39C93] text-xs mt-3">
            Deadline: {formatDateLabel(task.deadline)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button className="p-3 rounded-full bg-[#F8F7F3] text-[#8C7A6B] hover:bg-[#3A3836] hover:text-white transition-colors">
          <Play className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-3 rounded-full bg-rose-50 text-rose-300 hover:text-rose-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}