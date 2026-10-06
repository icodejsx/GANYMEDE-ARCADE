const STEPS = [
  {
    num: "01",
    title: "Find a game",
    body: "Open the store, pick a genre, and open a title page.",
  },
  {
    num: "02",
    title: "Publish yours",
    body: "Connect Freighter, add copy and screenshots, upload a Windows build.",
  },
  {
    num: "03",
    title: "Pay or claim",
    body: "Send XLM for paid games, or claim free ones. Then download.",
  },
];

export function HomeFlow() {
  return (
    <section className="home-section home-flow" id="how" data-animate="section">
      <div className="home-section__inner">
        <p className="section-kicker">How it works</p>
        <h2 className="section-title">Browse, publish, unlock.</h2>
        <p className="section-lead section-lead--narrow">
          Same path for players and developers: wallet in, file out.
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
