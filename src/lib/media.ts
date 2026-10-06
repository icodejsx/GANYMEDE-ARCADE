import { ipfsUrl } from "@/lib/ipfs/pinata";

/** Resolve cover/build media: local paths, absolute URLs, or IPFS CIDs. */
export function mediaUrl(ref: string): string {
  if (!ref) return "";
  if (ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("/")) {
    return ref;
  }
  if (ref.startsWith("demo:")) {
    return `/demo/${ref.slice("demo:".length)}.jpg`;
  }
  return ipfsUrl(ref);
}
