import { NextRequest, NextResponse } from "next/server";
import { isAuth } from "@utils/auth";

export async function middleware(req: NextRequest) {
  const authenticated = await isAuth(req);

  if (!authenticated) {
    return NextResponse.next();
  }

  return NextResponse.redirect("/dashboard");
}
