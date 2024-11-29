import { getTranslations } from "@/mongodb/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const translations = await getTranslations(userId!);
  return NextResponse.json({ translations });
}
