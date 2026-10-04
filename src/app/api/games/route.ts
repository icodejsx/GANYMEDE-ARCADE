import { NextResponse } from "next/server";
import { createGame, listPublishedGames } from "@/lib/games";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre") || undefined;
  const games = await listPublishedGames(genre || undefined);
  return NextResponse.json(games);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      genre?: string;
      priceXlm?: string;
      developerWallet?: string;
      coverCid?: string;
      screenshotCids?: string[];
      buildCid?: string;
      buildFilename?: string;
    };

    const required = [
      "title",
      "description",
      "genre",
      "priceXlm",
      "developerWallet",
      "coverCid",
      "buildCid",
      "buildFilename",
    ] as const;

    for (const key of required) {
      if (!body[key] && body[key] !== "0") {
        return NextResponse.json(
          { error: `${key} is required` },
          { status: 400 },
        );
      }
    }

    const game = await createGame({
      title: body.title!,
      description: body.description!,
      genre: body.genre!,
      priceXlm: String(body.priceXlm),
      developerWallet: body.developerWallet!,
      coverCid: body.coverCid!,
      screenshotCids: Array.isArray(body.screenshotCids)
        ? body.screenshotCids
        : [],
      buildCid: body.buildCid!,
      buildFilename: body.buildFilename!,
    });

    return NextResponse.json(game, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
