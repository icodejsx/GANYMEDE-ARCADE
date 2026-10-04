import { BillboardHero } from "@/components/home/BillboardHero";
import { FloorSection } from "@/components/home/FloorSection";
import { listPublishedGames } from "@/lib/games";

type Props = {
  searchParams: Promise<{ genre?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const genre = params.genre || "All";
  const games = await listPublishedGames(genre === "All" ? undefined : genre);

  return (
    <main>
      <BillboardHero />
      <FloorSection
        activeGenre={genre}
        games={games.map((g) => ({
          slug: g.slug,
          title: g.title,
          genre: g.genre,
          priceXlm: g.priceXlm,
          coverCid: g.coverCid,
        }))}
      />
    </main>
  );
}
