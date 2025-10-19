import { NextResponse } from "next/server";

export function middleware(req) {
  // قراءة الـ Token من الكوكي
  const token = req.cookies.get("authUser");

  // المسارات التي تريد حمايتها
  const protectedPaths = [
    "/",
    "/buyPage",
  ];

  // المسارات العامة (غير محمية)
  const publicPaths = ["/login", "/signup"];

  const { pathname } = req.nextUrl;

  // إذا كان المستخدم يحاول الوصول إلى صفحة محمية ولم يكن لديه Token
  if (protectedPaths.includes(pathname) && !token) {
    // توجيه المستخدم إلى صفحة تسجيل الدخول
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // إذا كان المستخدم لديه Token ويحاول الوصول إلى صفحة عامة (مثل تسجيل الدخول)
  if (publicPaths.includes(pathname) && token) {
    // توجيه المستخدم إلى الصفحة الرئيسية
    return NextResponse.redirect(new URL("/", req.url));
  }

  // إذا كان كل شيء على ما يرام، يتم تحميل الصفحة
  return NextResponse.next();
}
