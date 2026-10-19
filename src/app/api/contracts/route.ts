import { put } from "@vercel/blob";
import { getCurrentUser, getUserOpenAIKey } from "@/lib/dal";
import { analyzeContract, describeOpenAIError, getFileKind, MODEL } from "@/lib/analyze";
import { Contract } from "@/models/Contract";

// AI 審查可能要花數十秒
export const maxDuration = 60;

// Vercel Function 的請求內容上限是 4.5MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;

const unauthorized = () => Response.json({ error: "請先登入" }, { status: 401 });

export async function POST(request: Request) {
  // getCurrentUser 會先連上資料庫，連線失敗時就不會白白花費 OpenAI 額度並在 Blob 留下孤兒檔案
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "請選擇要上傳的合約檔案" }, { status: 400 });
  }
  if (!getFileKind(file)) {
    return Response.json({ error: "僅支援 PDF、DOCX、TXT 檔案" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "檔案大小不可超過 4MB" }, { status: 400 });
  }

  const apiKey = await getUserOpenAIKey(user.id);
  if (!apiKey) {
    return Response.json(
      { error: "尚未設定 OpenAI API Key，請先到設定頁輸入你的金鑰", code: "NO_API_KEY" },
      { status: 400 },
    );
  }

  try {
    // 先跑 AI 審查，成功後才上傳 Blob，避免金鑰無效或額度不足時留下沒有報告的孤兒檔案
    const analysis = await analyzeContract(file, apiKey);
    const blob = await put(`contracts/${user.id}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    const contract = await Contract.create({
      user: user.id,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      blobUrl: blob.url,
      blobPathname: blob.pathname,
      status: "completed",
      model: MODEL,
      analysis,
    });

    return Response.json({ id: contract._id.toString() }, { status: 201 });
  } catch (error) {
    const openAIMessage = describeOpenAIError(error);
    if (openAIMessage) return Response.json({ error: openAIMessage, code: "OPENAI_ERROR" }, { status: 400 });

    console.error("合約審查失敗", error);
    const message = error instanceof Error ? error.message : "未知錯誤";
    return Response.json({ error: `合約審查失敗：${message}` }, { status: 500 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const contracts = await Contract.find({ user: user.id })
    .select("fileName fileSize mimeType status analysis.contractType analysis.overallRisk createdAt")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return Response.json(contracts);
}
