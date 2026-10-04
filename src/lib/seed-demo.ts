import { canUseDatabase, prisma } from "@/lib/db";
import { DEMO_CATALOG } from "@/lib/demo-catalog";

export async function ensureDemoGames() {
  if (!canUseDatabase()) return;

  try {
    for (const game of DEMO_CATALOG) {
      await prisma.game.upsert({
        where: { slug: game.slug },
        create: {
          slug: game.slug,
          title: game.title,
          description: game.description,
          genre: game.genre,
          priceXlm: game.priceXlm,
          developerWallet: game.developerWallet,
          coverCid: game.coverCid,
          screenshotCids: game.screenshotCids,
          buildCid: game.buildCid,
          buildFilename: game.buildFilename,
          published: true,
        },
        update: {
          title: game.title,
          description: game.description,
          genre: game.genre,
          priceXlm: game.priceXlm,
          coverCid: game.coverCid,
          screenshotCids: game.screenshotCids,
          buildCid: game.buildCid,
          buildFilename: game.buildFilename,
          published: true,
        },
      });
    }
  } catch (error) {
    console.warn("Demo seed skipped (database unavailable):", error);
  }
}
