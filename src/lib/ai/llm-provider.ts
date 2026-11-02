export class AIConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIConfigurationError";
  }
}

export class AIExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIExecutionError";
  }
}

interface LLMCallOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

export async function callLLMProvider(options: LLMCallOptions): Promise<string> {
  const apiKey =
    process.env.LLM_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new AIConfigurationError(
      "LLM API key is not configured. Please add LLM_API_KEY to your .env.local file to enable AI Disease Assessment."
    );
  }

  // Determine provider
  let provider = (process.env.LLM_PROVIDER || "").toLowerCase().trim();
  if (!provider) {
    if (apiKey.startsWith("AIzaSy")) {
      provider = "gemini";
    } else if (apiKey.startsWith("gsk_")) {
      provider = "groq";
    } else if (apiKey.startsWith("sk-")) {
      provider = "openai";
    } else {
      provider = "gemini";
    }
  }

  if (provider === "gemini") {
    return callGemini(apiKey, options);
  } else if (provider === "groq") {
    return callGroq(apiKey, options);
  } else if (provider === "openai") {
    return callOpenAI(apiKey, options);
  } else {
    // Default to Gemini API
    return callGemini(apiKey, options);
  }
}

async function callGemini(
  apiKey: string,
  options: LLMCallOptions
): Promise<string> {
  const model = process.env.LLM_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${options.systemPrompt}\n\n---\nPATIENT DATA & REQUEST:\n${options.userPrompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.2,
      responseMimeType: "application/json",
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      let message = `Gemini API returned HTTP ${response.status}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.message) {
          message += `: ${errJson.error.message}`;
        }
      } catch {
        // use default message
      }
      throw new AIExecutionError(message);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new AIExecutionError("Gemini returned an empty response.");
    }

    return text;
  } catch (err: unknown) {
    if (err instanceof AIConfigurationError || err instanceof AIExecutionError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new AIExecutionError(`Failed to communicate with Gemini API: ${message}`);
  }
}

async function callGroq(apiKey: string, options: LLMCallOptions): Promise<string> {
  const model = process.env.LLM_MODEL || "llama-3.3-70b-versatile";
  const url = "https://api.groq.com/openai/v1/chat/completions";

  return callOpenAICompatible(url, apiKey, model, options);
}

async function callOpenAI(apiKey: string, options: LLMCallOptions): Promise<string> {
  const model = process.env.LLM_MODEL || "gpt-4o-mini";
  const baseUrl = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

  return callOpenAICompatible(url, apiKey, model, options);
}

async function callOpenAICompatible(
  url: string,
  apiKey: string,
  model: string,
  options: LLMCallOptions
): Promise<string> {
  const payload = {
    model,
    temperature: options.temperature ?? 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: options.systemPrompt },
      { role: "user", content: options.userPrompt },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      let message = `LLM API returned HTTP ${response.status}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.message) {
          message += `: ${errJson.error.message}`;
        }
      } catch {
        // default message
      }
      throw new AIExecutionError(message);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new AIExecutionError("LLM returned an empty response.");
    }

    return content;
  } catch (err: unknown) {
    if (err instanceof AIConfigurationError || err instanceof AIExecutionError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new AIExecutionError(`LLM API connection error: ${message}`);
  }
}
