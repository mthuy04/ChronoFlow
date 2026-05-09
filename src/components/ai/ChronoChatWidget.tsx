"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type ChatApiResponse = {
  answer?: string;
  message?: string;
};

const suggestedPrompts = [
  "Hôm nay mình nên bắt đầu từ đâu?",
  "Lịch hôm nay có quá tải không?",
  "Mình hay trì hoãn buổi tối thì nên làm gì?",
  "Giải thích peak focus window cho mình.",
];

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChronoChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Chào bạn, mình là Chrono AI Coach 🌙 Bạn có thể hỏi mình về lịch học/làm việc, task, chronotype, peak focus hoặc cách giữ nhịp năng lượng hôm nay.",
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const visibleHistory = useMemo(
    () =>
      messages
        .filter((message) => message.id !== "welcome")
        .map((message) => ({
          role: message.role,
          content: message.content,
        })),
    [messages],
  );

  async function sendMessage(customPrompt?: string) {
    const text = (customPrompt ?? input).trim();

    if (!text || isSending) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: text,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: visibleHistory,
        }),
      });

      const data = (await response.json()) as ChatApiResponse;

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        content:
          data.answer ??
          data.message ??
          "Mình chưa trả lời được câu này. Bạn thử hỏi lại theo hướng task, lịch học hoặc năng lượng nha.",
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content:
            "Có lỗi khi kết nối Chrono AI. Bạn kiểm tra lại mạng hoặc thử lại sau nha.",
        },
      ]);
    } finally {
      setIsSending(false);
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
          window.setTimeout(() => inputRef.current?.focus(), 120);
        }}
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6F59FF] via-[#7C6CFF] to-[#4DA8FF] text-white shadow-[0_18px_50px_rgba(89,79,255,0.35)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(89,79,255,0.45)]"
        aria-label="Mở Chrono AI Coach"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-400">
          <Sparkles className="h-3 w-3 text-white" />
        </span>
      </button>
    );
  }

  return (
    <section
      className="fixed bottom-5 right-5 z-[70] w-[calc(100vw-2.5rem)] max-w-[390px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 shadow-[0_28px_90px_rgba(45,36,96,0.22)] backdrop-blur-2xl"
      aria-label="Chrono AI Coach"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-[#F2EDFF] via-[#E9E2FF] to-[#DCEBFF] px-5 py-4">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/45 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-[#9FB6FF]/30 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85 text-[#6F59FF] shadow-sm">
              <Bot className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black tracking-tight text-[#1A1528]">
                Chrono AI Coach
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#6B6384]">
                Hỏi về task, nhịp năng lượng & lịch học
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMinimized((current) => !current)}
              className="rounded-full bg-white/70 p-2 text-[#5B566E] transition hover:bg-white"
              aria-label={isMinimized ? "Mở rộng chatbot" : "Thu nhỏ chatbot"}
            >
              <ChevronDown
                className={`h-4 w-4 transition ${
                  isMinimized ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-white/70 p-2 text-[#5B566E] transition hover:bg-white"
              aria-label="Đóng chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {!isMinimized ? (
        <>
          <div className="max-h-[430px] space-y-3 overflow-y-auto bg-gradient-to-b from-white to-[#F8F6FF] px-4 py-4">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-[1.35rem] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white"
                        : "border border-[#EEE9FF] bg-white text-[#312B45]"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              );
            })}

            {isSending ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-[1.35rem] border border-[#EEE9FF] bg-white px-4 py-3 text-sm font-semibold text-[#6B6384] shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chrono AI đang suy nghĩ...
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-[#EEE9FF] bg-white px-4 py-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  disabled={isSending}
                  className="shrink-0 rounded-full border border-[#E4DCFF] bg-[#F7F4FF] px-3 py-2 text-xs font-bold text-[#5F55B7] transition hover:border-[#B8AAFF] hover:bg-[#EFEAFF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded-full border border-[#E5DEFF] bg-[#FAF8FF] p-1.5"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Hỏi Chrono AI..."
                className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-[#1A1528] outline-none placeholder:text-[#9A93AD]"
                disabled={isSending}
              />

              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Gửi câu hỏi"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>

            <p className="mt-2 text-center text-[10px] font-semibold text-[#9A93AD]">
              Chrono AI hỗ trợ lập kế hoạch & nhịp năng lượng, không thay thế tư
              vấn y tế.
            </p>
          </div>
        </>
      ) : null}
    </section>
  );
}