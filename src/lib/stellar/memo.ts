const PREFIX = "ganymede:";
const MAX_BYTES = 28;

export function buildPaymentMemo(gameId: string): string {
  const budget = MAX_BYTES - PREFIX.length;
  const id = gameId.slice(0, budget);
  return `${PREFIX}${id}`;
}

export function parsePaymentMemo(memo: string): string | null {
  if (!memo.startsWith(PREFIX)) return null;
  const id = memo.slice(PREFIX.length);
  return id.length > 0 ? id : null;
}
