import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export type CreateGameInput = {
  title: string;
  description: string;
  genre: string;
  priceXlm: string;
  developerWallet: string;
  coverCid: string;
  screenshotCids: string[];
  buildCid: string;
  buildFilename: string;
};

export async function listPublishedGames(genre?: string) {
  return prisma.game.findMany({
    where: {
      published: true,
      ...(genre && genre !== "All" ? { genre } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getGameBySlug(slug: string) {
  return prisma.game.findUnique({ where: { slug } });
}

export async function getGameById(id: string) {
  return prisma.game.findUnique({ where: { id } });
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let i = 0;
  while (await prisma.game.findUnique({ where: { slug: candidate } })) {
    i += 1;
    candidate = `${base}-${i}`;
  }
  return candidate;
}

export async function createGame(input: CreateGameInput) {
  const slug = await uniqueSlug(input.title);
  return prisma.game.create({
    data: {
      slug,
      title: input.title,
      description: input.description,
      genre: input.genre,
      priceXlm: input.priceXlm,
      developerWallet: input.developerWallet,
      coverCid: input.coverCid,
      screenshotCids: JSON.stringify(input.screenshotCids),
      buildCid: input.buildCid,
      buildFilename: input.buildFilename,
      published: true,
    },
  });
}

export function parseScreenshotCids(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}
