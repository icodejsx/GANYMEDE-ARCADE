import { prisma } from "@/lib/db";

const DEMO_WALLET =
  "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

const DEMOS = [
  {
    slug: "night-drift",
    title: "Night Drift",
    description:
      "A neon highway runner set on a frozen moon. Drift, dodge, and chase the horizon until the ice cracks under your tires.",
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
      "Dock freighters, balance cargo, and keep the orbital lanes calm. A free puzzle about patience in deep space.",
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
      "Turn-based strategy across ash moons and relay stations. Claim territory before the network collapses.",
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
      "Explore abandoned research vaults under Ganymede ice. Atmospheric adventure through silent corridors and old signals.",
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
      "Fold radio noise into playable patterns. An experimental title for players who like strange systems.",
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
      "Race courier drones through glacial canyons. Tight action, cold light, and perfect lines.",
    genre: "Action",
    priceXlm: "4",
    coverCid: "/demo/night-drift.jpg",
    screenshotCids: JSON.stringify(["/demo/night-drift.jpg"]),
    buildCid: "/demo/night-drift.jpg",
    buildFilename: "FrostLane-demo.zip",
  },
  {
    slug: "harbor-null",
    title: "Harbor Null",
    description:
      "Rebuild a silent dockyard one crate at a time. Free puzzle about order in the void.",
    genre: "Puzzle",
    priceXlm: "0",
    coverCid: "/demo/quiet-ports.jpg",
    screenshotCids: JSON.stringify(["/demo/quiet-ports.jpg"]),
    buildCid: "/demo/quiet-ports.jpg",
    buildFilename: "HarborNull-demo.zip",
  },
  {
    slug: "ember-grid",
    title: "Ember Grid",
    description:
      "Command relay nodes across a burning network. Strategy for players who think three turns ahead.",
    genre: "Strategy",
    priceXlm: "6",
    coverCid: "/demo/ash-circuit.jpg",
    screenshotCids: JSON.stringify(["/demo/ash-circuit.jpg"]),
    buildCid: "/demo/ash-circuit.jpg",
    buildFilename: "EmberGrid-demo.zip",
  },
];

export async function ensureDemoGames() {
  for (const game of DEMOS) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      create: {
        ...game,
        developerWallet: DEMO_WALLET,
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
}
