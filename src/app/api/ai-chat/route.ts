import { NextResponse } from "next/server";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

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

const CHRONOFLOW_SYSTEM_CONTEXT = `
Bạn là Chrono AI Coach của ChronoFlow.

ChronoFlow là web app lập kế hoạch học tập/làm việc theo nhịp sinh học cá nhân.
Thông điệp cốt lõi: "Không phải học nhiều hơn — mà học đúng thời điểm năng lượng cao nhất của bạn."

Bạn chỉ hỗ trợ các chủ đề:
- planner, task, deadline, lịch học/làm việc
- chronotype: Lion, Bear, Wolf, Dolphin
- peak focus window, energy rhythm, recovery window
- focus session, trì hoãn, quá tải, burnout nhẹ
- cách sắp xếp task theo năng lượng cá nhân

Quy tắc trả lời:
- Luôn trả lời bằng tiếng Việt.
- Giọng văn ấm áp, rõ ràng, thực tế, không giáo điều.
- Trả lời ngắn gọn, ưu tiên hành động cụ thể.
- Không bịa dữ liệu cá nhân nếu context không cung cấp.
- Nếu user hỏi ngoài phạm vi ChronoFlow, hãy lịch sự kéo về chủ đề lập kế hoạch, năng lượng, tập trung hoặc học/làm việc.
- Không đưa lời khuyên y tế/chẩn đoán sức khỏe. Nếu liên quan sức khỏe nghiêm trọng, khuyên user tìm chuyên gia.
- Không nói rằng bạn đã được "train bằng dữ liệu user". Hãy nói bạn dựa trên context ChronoFlow được cung cấp.
`;

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

function buildPrompt(message: string, history: ChatMessage[]) {
  const historyText =
    history.length > 0
      ? history
          .map((item) => {
            const speaker = item.role === "user" ? "User" : "Chrono AI";
            return `${speaker}: ${item.content}`;
          })
          .join("\n")
      : "Chưa có lịch sử trò chuyện.";

  return `
${CHRONOFLOW_SYSTEM_CONTEXT}

Lịch sử trò chuyện gần đây:
${historyText}

Câu hỏi hiện tại của user:
${message}

Hãy trả lời như Chrono AI Coach.
`;
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

    const prompt = buildPrompt(message, history);

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
            temperature: 0.65,
            topP: 0.9,
            maxOutputTokens: 700,
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