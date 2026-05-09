import { NextResponse } from "next/server";
import {
  buildChronoAIPrompt,
  type ChatMessage,
} from "@/lib/ai/chrono-ai-context";

type GeminiPart = {
  text?: string;
};

type GeminiContent = {
  parts?: GeminiPart[];
};

type GeminiCandidate = {
  content?: GeminiContent;
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
  error?: {
    message?: string;
  };
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;

  const maybe = value as Record<string, unknown>;

  return (
    (maybe.role === "user" || maybe.role === "assistant") &&
    typeof maybe.content === "string"
  );
}

function normalizeHistory(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isChatMessage)
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 1000),
    }));
}

function extractGeminiText(data: GeminiResponse) {
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  return text;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            "Thiếu GEMINI_API_KEY. Hãy thêm key vào .env.local hoặc Vercel Environment Variables.",
        },
        { status: 500 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = normalizeHistory(body.history);

    if (!message) {
      return NextResponse.json(
        { message: "Bạn chưa nhập nội dung câu hỏi." },
        { status: 400 },
      );
    }

    if (message.length > 1200) {
      return NextResponse.json(
        { message: "Câu hỏi hơi dài. Bạn rút ngắn lại một chút nha." },
        { status: 400 },
      );
    }

    const prompt = buildChronoAIPrompt({
      message,
      history,
    });

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.55,
            topP: 0.88,
            maxOutputTokens: 650,
          },
        }),
      },
    );

    const data = (await geminiResponse.json()) as GeminiResponse;

    if (!geminiResponse.ok) {
      return NextResponse.json(
        {
          message:
            data.error?.message ??
            "Gemini API đang gặp lỗi. Hãy thử lại sau một chút.",
        },
        { status: geminiResponse.status },
      );
    }

    const answer = extractGeminiText(data);

    if (!answer) {
      return NextResponse.json(
        {
          message:
            "Chrono AI chưa tạo được câu trả lời. Bạn thử hỏi lại ngắn hơn nha.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("[AI_CHAT_ERROR]", error);

    return NextResponse.json(
      {
        message:
          "Có lỗi khi gọi Chrono AI. Kiểm tra lại GEMINI_API_KEY hoặc thử lại sau.",
      },
      { status: 500 },
    );
  }
}