import { NextResponse } from "next/server";
import { claimOrVerifyPurchase, getEntitlement } from "@/lib/purchases";
import { getGameById } from "@/lib/games";
import { mediaUrl } from "@/lib/media";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get("gameId");
  const buyerWallet = searchParams.get("buyerWallet");
  if (!gameId || !buyerWallet) {
    return NextResponse.json(
      { error: "gameId and buyerWallet are required" },
      { status: 400 },
    );
  }
  const game = await getGameById(gameId);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  const purchase = await getEntitlement(gameId, buyerWallet);
  if (!purchase) {
    return NextResponse.json({ entitled: false });
  }
  return NextResponse.json({
    entitled: true,
    downloadUrl: mediaUrl(game.buildCid),
    filename: game.buildFilename,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      gameId?: string;
      buyerWallet?: string;
      txHash?: string;
    };
    if (!body.gameId || !body.buyerWallet) {
      return NextResponse.json(
        { error: "gameId and buyerWallet are required" },
        { status: 400 },
      );
    }
    const result = await claimOrVerifyPurchase({
      gameId: body.gameId,
      buyerWallet: body.buyerWallet,
      txHash: body.txHash,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }
    return NextResponse.json({
      entitled: true,
      downloadUrl: result.downloadUrl,
      filename: result.filename,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Purchase failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
