"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { createSession, deleteSession } from "@/lib/session";
import { User } from "@/models/User";

export type AuthState = { error?: string; email?: string } | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function signup(_state: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!EMAIL_PATTERN.test(email)) return { error: "請輸入有效的 Email", email };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `密碼至少需要 ${MIN_PASSWORD_LENGTH} 個字元`, email };
  }
  // bcrypt 只會使用前 72 bytes，超過的部分會被忽略
  if (Buffer.byteLength(password) > 72) return { error: "密碼過長", email };
  if (password !== confirmPassword) return { error: "兩次輸入的密碼不一致", email };

  await connectDB();
  if (await User.exists({ email })) return { error: "這個 Email 已經註冊過了", email };

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash });

  await createSession(user._id.toString());
  redirect("/upload");
}

export async function login(_state: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) return { error: "請輸入 Email 與密碼", email };

  await connectDB();
  const user = await User.findOne({ email }).select("+passwordHash");

  // 帳號不存在與密碼錯誤顯示相同訊息，避免被拿來探測哪些 Email 已註冊
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Email 或密碼錯誤", email };
  }

  await createSession(user._id.toString());
  redirect("/upload");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
