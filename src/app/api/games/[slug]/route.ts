import { NextResponse } from "next/server";
import { getGameBySlug } from "@/lib/games";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const game = await getGameBySlug(slug);
  if (!game) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(game);
}
