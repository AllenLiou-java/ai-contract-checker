import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { decryptSecret } from "@/lib/crypto";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";

export type CurrentUser = { id: string; email: string; openaiKeyLast4: string | null };

// 讀取目前登入的使用者；cookie 無效或使用者已不存在時回傳 null
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();
  if (!session || !isValidObjectId(session.userId)) return null;

  // 資料庫查詢（MongoDB 驅動內部會呼叫 new Date()）只能在真正的請求中執行，不能進入預先渲染
  await connection();
  await connectDB();
  const user = await User.findById(session.userId).lean();
  return user
    ? { id: user._id.toString(), email: user.email, openaiKeyLast4: user.openaiKeyLast4 ?? null }
    : null;
});

// 頁面用：未登入就導向登入頁
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// 取出並解密使用者的 OpenAI API Key；只在伺服器端呼叫 OpenAI 前使用，絕不回傳給瀏覽器
export async function getUserOpenAIKey(userId: string): Promise<string | null> {
  await connectDB();
  const user = await User.findById(userId).select("+openaiKey").lean();
  if (!user?.openaiKey?.ciphertext || !user.openaiKey.iv || !user.openaiKey.tag) return null;
  return decryptSecret({
    ciphertext: user.openaiKey.ciphertext,
    iv: user.openaiKey.iv,
    tag: user.openaiKey.tag,
  });
}
