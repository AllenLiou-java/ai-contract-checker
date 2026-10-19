import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = { title: "註冊 | AI 合約審查器" };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
