"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export type TokenInfo = {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Operator";
    org_id: number;
  };

export const createSession = async (accessToken: string) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  cookies().set("session", accessToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  redirect("/");
};

export const verifySession = async () => {
  const cookie = cookies().get("session")?.value;
  if (!cookie) redirect("/login");
  const session = jwtDecode(cookie!) as TokenInfo;
  if (!session.id) redirect("/login");
  return { isAuth: true, userId: session.id };
};

export const sessionInfo = () => {
  const cookie = cookies().get("session")?.value;
  if (!cookie) return null;
  const session = jwtDecode(cookie!) as TokenInfo;
  return session;
};

export const deleteSession = () => {
  cookies().delete("session");
  redirect("/login");
};
