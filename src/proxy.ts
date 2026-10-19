import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, decrypt } from "@/lib/session";

const PUBLIC_ROUTES = ["/"];
const AUTH_ROUTES = ["/login", "/signup"];

// 只做「有沒有合法 session cookie」的樂觀檢查，真正的權限驗證在頁面與 API 的資料存取層
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await decrypt(request.cookies.get(COOKIE_NAME)?.value);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (!session && !isAuthRoute && !PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/upload", request.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
