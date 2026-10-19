import OpenAI from "openai";
import mammoth from "mammoth";
import type { ResponseInputContent } from "openai/resources/responses/responses";

export type Severity = "low" | "medium" | "high";

export type ContractAnalysis = {
  contractType: string;
  summary: string;
  overallRisk: Severity;
  parties: string[];
  keyTerms: { title: string; content: string }[];
  risks: { clause: string; issue: string; severity: Severity; suggestion: string }[];
  missingClauses: string[];
  recommendations: string[];
};

export const MODEL = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";

export type FileKind = "pdf" | "docx" | "txt";

const MIME_KINDS: Record<string, FileKind> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "text/plain": "txt",
};

// 部分瀏覽器上傳 docx 時 file.type 會是空字串，所以再用副檔名判斷一次
export function getFileKind(file: File): FileKind | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return MIME_KINDS[file.type] ?? (ext === "pdf" || ext === "docx" || ext === "txt" ? ext : null);
}

// BYOK：每次都用使用者自己的 API Key 建立 client，不使用伺服器端的金鑰
function createClient(apiKey: string) {
  return new OpenAI({ apiKey, maxRetries: 1 });
}

export function isInsufficientQuota(error: unknown) {
  return error instanceof OpenAI.RateLimitError && error.code === "insufficient_quota";
}

// 把 OpenAI 的錯誤轉成使用者看得懂、知道怎麼處理的訊息
export function describeOpenAIError(error: unknown): string | null {
  if (error instanceof OpenAI.AuthenticationError) return "OpenAI API Key 無效或已被撤銷，請到設定頁更新金鑰";
  if (error instanceof OpenAI.PermissionDeniedError || error instanceof OpenAI.NotFoundError) {
    return `你的 OpenAI 帳號無法使用 ${MODEL} 模型`;
  }
  if (isInsufficientQuota(error)) return "你的 OpenAI 帳號額度不足，請到 OpenAI 後台儲值或檢查付款方式";
  if (error instanceof OpenAI.RateLimitError) return "OpenAI 請求過於頻繁，請稍後再試";
  return null;
}

// 儲存前先打一次輕量 API 確認金鑰可用
export async function verifyOpenAIKey(apiKey: string) {
  await createClient(apiKey).models.retrieve(MODEL);
}

const SYSTEM_PROMPT = `你是一位資深的合約審查律師。請仔細閱讀使用者提供的合約，
從保護「簽約方（使用者）」權益的角度進行審查，找出不利條款、模糊用語、潛在風險與缺漏條款，
並提出具體可行的修改建議。所有輸出一律使用繁體中文。`;

const severity = { type: "string", enum: ["low", "medium", "high"] };

const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "contractType",
    "summary",
    "overallRisk",
    "parties",
    "keyTerms",
    "risks",
    "missingClauses",
    "recommendations",
  ],
  properties: {
    contractType: { type: "string", description: "合約類型，例如：租賃契約、勞動契約" },
    summary: { type: "string", description: "合約重點摘要，約 100-200 字" },
    overallRisk: { ...severity, description: "整體風險等級" },
    parties: { type: "array", items: { type: "string" }, description: "合約當事人" },
    keyTerms: {
      type: "array",
      description: "重要條款，例如期限、金額、付款方式、終止條件",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "content"],
        properties: { title: { type: "string" }, content: { type: "string" } },
      },
    },
    risks: {
      type: "array",
      description: "風險條款",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["clause", "issue", "severity", "suggestion"],
        properties: {
          clause: { type: "string", description: "原文條款或條號" },
          issue: { type: "string", description: "問題說明" },
          severity,
          suggestion: { type: "string", description: "修改建議" },
        },
      },
    },
    missingClauses: { type: "array", items: { type: "string" }, description: "建議補充的缺漏條款" },
    recommendations: { type: "array", items: { type: "string" }, description: "簽約前的整體建議" },
  },
};

async function toInputContent(file: File): Promise<ResponseInputContent> {
  const buffer = Buffer.from(await file.arrayBuffer());

  switch (getFileKind(file)) {
    case "pdf":
      return {
        type: "input_file",
        filename: file.name,
        file_data: `data:application/pdf;base64,${buffer.toString("base64")}`,
      };
    case "docx": {
      const { value } = await mammoth.extractRawText({ buffer });
      return { type: "input_text", text: `合約內容：\n${value}` };
    }
    default:
      return { type: "input_text", text: `合約內容：\n${buffer.toString("utf8")}` };
  }
}

export async function analyzeContract(file: File, apiKey: string): Promise<ContractAnalysis> {
  const response = await createClient(apiKey).responses.create({
    model: MODEL,
    instructions: SYSTEM_PROMPT,
    input: [
      {
        role: "user",
        content: [await toInputContent(file), { type: "input_text", text: "請審查這份合約。" }],
      },
    ],
    text: {
      format: { type: "json_schema", name: "contract_analysis", strict: true, schema: ANALYSIS_SCHEMA },
    },
  });

  if (!response.output_text) {
    throw new Error("AI 沒有回傳審查結果");
  }
  return JSON.parse(response.output_text) as ContractAnalysis;
}
