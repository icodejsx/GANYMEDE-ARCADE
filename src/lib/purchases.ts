import { canUseDatabase, prisma } from "@/lib/db";
import { getGameById } from "@/lib/games";
import { mediaUrl } from "@/lib/media";
import { verifyXlmPayment } from "@/lib/stellar/verify-payment";

export async function hasEntitlement(gameId: string, buyerWallet: string) {
  if (!canUseDatabase()) return false;
  try {
    const row = await prisma.purchase.findUnique({
      where: {
        gameId_buyerWallet: { gameId, buyerWallet },
      },
    });
    return Boolean(row);
  } catch {
    return false;
  }
}

export async function getEntitlement(gameId: string, buyerWallet: string) {
  if (!canUseDatabase()) return null;
  try {
    return await prisma.purchase.findUnique({
      where: {
        gameId_buyerWallet: { gameId, buyerWallet },
      },
    });
  } catch {
    return null;
  }
}

export async function claimOrVerifyPurchase(input: {
  gameId: string;
  buyerWallet: string;
  txHash?: string;
}) {
  const game = await getGameById(input.gameId);
  if (!game || !game.published) {
    return { ok: false as const, reason: "Game not found" };
  }

  const existing = await getEntitlement(input.gameId, input.buyerWallet);
  if (existing) {
    return {
      ok: true as const,
      entitled: true as const,
      downloadUrl: mediaUrl(game.buildCid),
      filename: game.buildFilename,
    };
  }

  const isFree = game.priceXlm === "0" || Number(game.priceXlm) === 0;

  if (isFree) {
    if (canUseDatabase()) {
      try {
        await prisma.purchase.create({
          data: {
            gameId: game.id,
            buyerWallet: input.buyerWallet,
            txHash: null,
            amountXlm: "0",
          },
        });
      } catch (error) {
        console.warn("Could not persist free claim:", error);
      }
    }
    return {
      ok: true as const,
      entitled: true as const,
      downloadUrl: mediaUrl(game.buildCid),
      filename: game.buildFilename,
    };
  }

  if (!input.txHash) {
    return { ok: false as const, reason: "txHash required for paid games" };
  }

  const verified = await verifyXlmPayment({
    txHash: input.txHash,
    expectedDestination: game.developerWallet,
    expectedAmountXlm: game.priceXlm,
    expectedBuyer: input.buyerWallet,
    expectedGameId: game.id,
  });

  if (!verified.ok) {
    return { ok: false as const, reason: verified.reason };
  }

  if (canUseDatabase()) {
    try {
      await prisma.purchase.create({
        data: {
          gameId: game.id,
          buyerWallet: input.buyerWallet,
          txHash: input.txHash,
          amountXlm: game.priceXlm,
        },
      });
    } catch (error) {
      console.warn("Could not persist purchase:", error);
    }
  }

  return {
    ok: true as const,
    entitled: true as const,
    downloadUrl: mediaUrl(game.buildCid),
    filename: game.buildFilename,
  };
}
