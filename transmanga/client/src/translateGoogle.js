import PQueue from "p-queue";

const translateGoogleQueue = new PQueue({
  interval: 1000,
  intervalCap: 3,
  concurrency: 3,
});

export function translateGoogle(texts, language, priority, signal) {
  return translateGoogleQueue.add(
    async () => pywebview.api.translate(texts, language),
    { priority, signal },
  );
}
