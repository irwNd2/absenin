import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { TokenInfo } from "./lib/session";

const publicRoutes = ["/login", "/forgot-passoword"];
const adminRoutes = ["/sekolah", "/operator-sekolah", "/"];
const operatorRoutes = [
  "/guru",
  "/kelas",
  "/mata-pelajaran",
  "/orang-tua",
  "/siswa",
  "/",
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);
  const isOperatorRoute = operatorRoutes.includes(path);
  const cookie = cookies().get("session")?.value;

  if (!cookie && (isAdminRoute || isOperatorRoute || path === "/")) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (cookie) {
    const session: TokenInfo = jwtDecode(cookie);
    if ((isAdminRoute || isOperatorRoute || path === "/") && !session.id) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isPublicRoute && session.id) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (path !== "/") {
      if (session.role === "Admin" && isOperatorRoute) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
      }
      if (session.role === "Operator" && isAdminRoute) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
      }
    }
  }

  return NextResponse.next();
}
