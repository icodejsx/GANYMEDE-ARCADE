import { notFound } from "next/navigation";
import { GamePurchasePanel } from "@/components/games/GamePurchasePanel";
import { getGameBySlug, parseScreenshotCids } from "@/lib/games";
import { mediaUrl } from "@/lib/media";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const screenshots = parseScreenshotCids(game.screenshotCids);

  return (
    <main className="game-page">
      <div
        className="game-page__hero"
        style={{ backgroundImage: `url(${mediaUrl(game.coverCid)})` }}
      />
      <div className="game-page__body">
        <div>
          <p className="eyebrow">{game.genre}</p>
          <h1>{game.title}</h1>
          <p className="game-page__desc">{game.description}</p>
          {screenshots.length > 0 ? (
            <div className="screenshot-row">
              {screenshots.map((cid) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={cid} src={mediaUrl(cid)} alt="" />
              ))}
            </div>
          ) : null}
        </div>
        <GamePurchasePanel
          gameId={game.id}
          priceXlm={game.priceXlm}
          developerWallet={game.developerWallet}
        />
      </div>
    </main>
  );
}
