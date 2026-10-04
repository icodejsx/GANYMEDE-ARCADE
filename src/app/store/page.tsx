import { HomeFooter } from "@/components/home/HomeFooter";
import { StoreCatalog } from "@/components/store/StoreCatalog";
import { listPublishedGames } from "@/lib/games";
import { ensureDemoGames } from "@/lib/seed-demo";

type Props = {
  searchParams: Promise<{ genre?: string }>;
};

export default async function StorePage({ searchParams }: Props) {
  const params = await searchParams;
  const genre = params.genre || "All";
  await ensureDemoGames();
  const games = await listPublishedGames(genre === "All" ? undefined : genre);

  return (
    <main>
      <StoreCatalog
        activeGenre={genre}
        games={games.map((g) => ({
          slug: g.slug,
          title: g.title,
          description: g.description,
          genre: g.genre,
          priceXlm: g.priceXlm,
          coverCid: g.coverCid,
        }))}
      />
      <HomeFooter />
    </main>
  );
}
