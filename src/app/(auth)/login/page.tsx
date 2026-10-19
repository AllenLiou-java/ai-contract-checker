import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = { title: "登入 | AI 合約審查器" };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
