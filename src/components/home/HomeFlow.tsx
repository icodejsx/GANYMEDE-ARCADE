const STEPS = [
  {
    num: "01",
    title: "Browse the floor",
    body: "Explore live game pages by genre. See what’s free and what’s priced in XLM.",
  },
  {
    num: "02",
    title: "Publish in minutes",
    body: "Connect Freighter, add your story and screenshots, upload a Windows build to IPFS.",
  },
  {
    num: "03",
    title: "Pay and unlock",
    body: "Buy with XLM or claim free titles. Entitlement unlocks the download — developers get paid to their wallet.",
  },
];

export function HomeFlow() {
  return (
    <section className="home-section home-flow" id="how" data-animate="section">
      <div className="home-section__inner">
        <p className="section-kicker">How it works</p>
        <h2 className="section-title">Three moves. Full loop.</h2>
        <p className="section-lead section-lead--narrow">
          Built for a clear demo path: discover, publish, settle on-chain.
        </p>
        <ol className="flow-list">
          {STEPS.map((step) => (
            <li key={step.num} className="flow-item" data-animate="flow-item">
              <span className="flow-item__num">{step.num}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
