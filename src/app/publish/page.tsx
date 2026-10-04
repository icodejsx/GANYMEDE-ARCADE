import { PublishForm } from "@/components/publish/PublishForm";

export default function PublishPage() {
  return (
    <main className="publish-page">
      <div className="publish-page__intro">
        <p className="eyebrow">DEVELOPER</p>
        <h1>Publish a game</h1>
        <p className="muted">
          Upload a cover, screenshots, and a Windows build to IPFS. Buyers pay
          your Freighter wallet in XLM.
        </p>
      </div>
      <PublishForm />
    </main>
  );
}
