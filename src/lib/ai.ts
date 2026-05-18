// AI 模型客户端封装
// 支持 Gemini / DeepSeek / Claude  三种模型，可配置切换

type AIModel = "gemini" | "deepseek" | "claude";

interface AICallOptions {
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  userPrompt: string;
  jsonMode?: boolean;
}

interface AIResponse {
  text: string;
  model: AIModel;
  usage: { promptTokens: number; completionTokens: number };
}

/**
 * 通用 AI 调用——根据 model 参数路由到不同 API
 * 需要在环境变量中配置对应 API Key:
 *   GEMINI_API_KEY / DEEPSEEK_API_KEY / CLAUDE_API_KEY
 */
export async function callAI(options: AICallOptions): Promise<AIResponse> {
  const model = options.model || "gemini";

  switch (model) {
    case "gemini":
      return callGemini(options);
    case "deepseek":
      return callDeepSeek(options);
    case "claude":
      return callClaude(options);
    default:
      throw new Error(`Unsupported model: ${model}`);
  }
}

async function callGemini(options: AICallOptions): Promise<AIResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const modelName = "gemini-2.5-flash";

  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: options.userPrompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 8192,
    },
  };

  if (options.systemPrompt) {
    body.systemInstruction = { parts: [{ text: options.systemPrompt }] };
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${errText.substring(0, 200)}`);
  }

  const data = await res.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    usageMetadata?: { promptTokenCount: number; candidatesTokenCount: number };
    error?: { message: string; code: number };
  };

  if (data.error) {
    throw new Error(`Gemini API错误: ${data.error.code} - ${data.error.message}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return {
    text,
    model: "gemini",
    usage: {
      promptTokens: data.usageMetadata?.promptTokenCount || 0,
      completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
    },
  };
}

async function callDeepSeek(options: AICallOptions): Promise<AIResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY not configured");

  const messages: { role: string; content: string }[] = [];
  if (options.systemPrompt) messages.push({ role: "system", content: options.systemPrompt });
  messages.push({ role: "user", content: options.userPrompt });

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 8192,
      response_format: options.jsonMode ? { type: "json_object" } : undefined,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DeepSeek HTTP ${res.status}: ${errText.substring(0, 200)}`);
  }

  const data = await res.json() as {
    choices?: { message?: { content?: string; refusal?: string } }[];
    usage?: { prompt_tokens: number; completion_tokens: number };
    error?: { message: string; type: string };
  };

  // 如果 API 返回错误
  if (data.error) {
    throw new Error(`DeepSeek API错误: ${data.error.type} - ${data.error.message}`);
  }

  return {
    text: data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.refusal || "",
    model: "deepseek",
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
    },
  };
}

async function callClaude(options: AICallOptions): Promise<AIResponse> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY not configured");

  const messages: { role: string; content: string }[] = [];
  if (options.systemPrompt) messages.push({ role: "system", content: options.systemPrompt });
  messages.push({ role: "user", content: options.userPrompt });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: options.maxTokens ?? 8192,
      messages: messages.filter(m => m.role !== "system"),
      system: options.systemPrompt,
      temperature: options.temperature ?? 0.7,
    }),
  });

  const data = await res.json() as {
    content?: { type: string; text?: string }[];
    usage?: { input_tokens: number; output_tokens: number };
  };

  return {
    text: data.content?.find(c => c.type === "text")?.text || "",
    model: "claude",
    usage: {
      promptTokens: data.usage?.input_tokens || 0,
      completionTokens: data.usage?.output_tokens || 0,
    },
  };
}
