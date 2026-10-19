"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/dal";
import { encryptSecret } from "@/lib/crypto";
import { describeOpenAIError, isInsufficientQuota, verifyOpenAIKey } from "@/lib/analyze";
import { User } from "@/models/User";

export type ApiKeyState = { error?: string; success?: string } | undefined;

// 同一個 action 處理儲存與刪除，由按鈕的 intent 決定
export async function manageApiKey(_state: ApiKeyState, formData: FormData): Promise<ApiKeyState> {
  const user = await getCurrentUser();
  if (!user) return { error: "請先登入" };

  if (formData.get("intent") === "delete") {
    await User.updateOne({ _id: user.id }, { $unset: { openaiKey: 1, openaiKeyLast4: 1 } });
    revalidatePath("/", "layout");
    return { success: "API Key 已刪除" };
  }

  const apiKey = String(formData.get("apiKey") ?? "").trim();
  if (!/^sk-[A-Za-z0-9_-]{20,}$/.test(apiKey)) {
    return { error: "格式不正確，OpenAI API Key 應以 sk- 開頭" };
  }

  try {
    await verifyOpenAIKey(apiKey);
  } catch (error) {
    // 額度不足的金鑰仍然有效，只是暫時無法使用，照樣保存
    if (!isInsufficientQuota(error)) {
      return { error: describeOpenAIError(error) ?? "無法驗證這組 API Key，請確認後再試一次" };
    }
  }

  await User.updateOne(
    { _id: user.id },
    { openaiKey: encryptSecret(apiKey), openaiKeyLast4: apiKey.slice(-4) },
  );
  revalidatePath("/", "layout");
  return { success: "API Key 已驗證並加密保存" };
}
