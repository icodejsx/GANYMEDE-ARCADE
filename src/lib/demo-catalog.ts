export type CatalogGame = {
  id: string;
  slug: string;
  title: string;
  description: string;
  genre: string;
  priceXlm: string;
  developerWallet: string;
  coverCid: string;
  screenshotCids: string;
  buildCid: string;
  buildFilename: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const DEMO_WALLET =
  "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

const NOW = new Date("2026-01-01T00:00:00.000Z");

const DEMOS: Omit<
  CatalogGame,
  "id" | "developerWallet" | "published" | "createdAt" | "updatedAt"
>[] = [
  {
    slug: "bomber-naut-67",
    title: "Bomber Naut 67",
    description:
      "Blast islands, clear levels, and push to the next map. Low-poly action with bomb-naut chaos.",
    genre: "Action",
    priceXlm: "0",
    coverCid: "/demo/bomber-naut-67.jpg",
    screenshotCids: JSON.stringify([
      "/demo/bomber-naut-67-shot.jpg",
      "/demo/bomber-naut-67.jpg",
    ]),
    buildCid: "/demo/bomber-naut-67.jpg",
    buildFilename: "BomberNaut67-demo.zip",
  },
  {
    slug: "night-drift",
    title: "Night Drift",
    description:
      "Highway runner. Stay on the line, clear traffic, finish the route.",
    genre: "Action",
    priceXlm: "3",
    coverCid: "/demo/night-drift.jpg",
    screenshotCids: JSON.stringify(["/demo/night-drift.jpg"]),
    buildCid: "/demo/night-drift.jpg",
    buildFilename: "NightDrift-demo.zip",
  },
  {
    slug: "quiet-ports",
    title: "Quiet Ports",
    description:
      "Dock freighters and sort cargo. Free puzzle about keeping lanes clear.",
    genre: "Puzzle",
    priceXlm: "0",
    coverCid: "/demo/quiet-ports.jpg",
    screenshotCids: JSON.stringify(["/demo/quiet-ports.jpg"]),
    buildCid: "/demo/quiet-ports.jpg",
    buildFilename: "QuietPorts-demo.zip",
  },
  {
    slug: "ash-circuit",
    title: "Ash Circuit",
    description:
      "Turn-based map control across relay stations. Hold the network.",
    genre: "Strategy",
    priceXlm: "5",
    coverCid: "/demo/ash-circuit.jpg",
    screenshotCids: JSON.stringify(["/demo/ash-circuit.jpg"]),
    buildCid: "/demo/ash-circuit.jpg",
    buildFilename: "AshCircuit-demo.zip",
  },
  {
    slug: "lunar-echo",
    title: "Lunar Echo",
    description:
      "Walk abandoned vaults under ice. Find the old signals.",
    genre: "Adventure",
    priceXlm: "2",
    coverCid: "/demo/lunar-echo.jpg",
    screenshotCids: JSON.stringify(["/demo/lunar-echo.jpg"]),
    buildCid: "/demo/lunar-echo.jpg",
    buildFilename: "LunarEcho-demo.zip",
  },
  {
    slug: "signal-fold",
    title: "Signal Fold",
    description:
      "Shape radio noise into patterns. Small experimental systems game.",
    genre: "Other",
    priceXlm: "1",
    coverCid: "/demo/signal-fold.jpg",
    screenshotCids: JSON.stringify(["/demo/signal-fold.jpg"]),
    buildCid: "/demo/signal-fold.jpg",
    buildFilename: "SignalFold-demo.zip",
  },
  {
    slug: "frost-lane",
    title: "Frost Lane",
    description:
      "Courier races through ice canyons. Short tracks, hard lines.",
    genre: "Action",
    priceXlm: "4",
    coverCid: "/demo/frost-lane.jpg",
    screenshotCids: JSON.stringify(["/demo/frost-lane.jpg"]),
    buildCid: "/demo/frost-lane.jpg",
    buildFilename: "FrostLane-demo.zip",
  },
  {
    slug: "harbor-null",
    title: "Harbor Null",
    description:
      "Rebuild a quiet dockyard crate by crate. Free puzzle.",
    genre: "Puzzle",
    priceXlm: "0",
    coverCid: "/demo/harbor-null.jpg",
    screenshotCids: JSON.stringify(["/demo/harbor-null.jpg"]),
    buildCid: "/demo/harbor-null.jpg",
    buildFilename: "HarborNull-demo.zip",
  },
  {
    slug: "ember-grid",
    title: "Ember Grid",
    description:
      "Command relay nodes on a hot map. Plan a few turns ahead.",
    genre: "Strategy",
    priceXlm: "6",
    coverCid: "/demo/ember-grid.jpg",
    screenshotCids: JSON.stringify(["/demo/ember-grid.jpg"]),
    buildCid: "/demo/ember-grid.jpg",
    buildFilename: "EmberGrid-demo.zip",
  },
];

export const DEMO_CATALOG: CatalogGame[] = DEMOS.map((game, index) => ({
  ...game,
  id: `demo-${game.slug}`,
  developerWallet: DEMO_WALLET,
  published: true,
  createdAt: new Date(NOW.getTime() - index * 86_400_000),
  updatedAt: NOW,
}));

export function listDemoGames(genre?: string): CatalogGame[] {
  const filtered =
    genre && genre !== "All"
      ? DEMO_CATALOG.filter((game) => game.genre === genre)
      : DEMO_CATALOG;
  return [...filtered].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export function getDemoGameBySlug(slug: string): CatalogGame | null {
  return DEMO_CATALOG.find((game) => game.slug === slug) ?? null;
}

export function getDemoGameById(id: string): CatalogGame | null {
  return DEMO_CATALOG.find((game) => game.id === id) ?? null;
}
