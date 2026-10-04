import { FloorSection } from "@/components/home/FloorSection";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeFlow } from "@/components/home/HomeFlow";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeMotion } from "@/components/home/HomeMotion";
import { HomeStellar } from "@/components/home/HomeStellar";
import { listPublishedGames } from "@/lib/games";
import { ensureDemoGames } from "@/lib/seed-demo";

type Props = {
  searchParams: Promise<{ genre?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const genre = params.genre || "All";
  await ensureDemoGames();
  const games = await listPublishedGames(genre === "All" ? undefined : genre);

  return (
    <HomeMotion>
      <main className="home-page">
        <HomeHero />
        <HomeAbout />
        <HomeFlow />
        <HomeStellar />
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
        <HomeFooter />
      </main>
    </HomeMotion>
  );
}
