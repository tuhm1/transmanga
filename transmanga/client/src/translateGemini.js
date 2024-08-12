import PQueue from "p-queue";

const translateGeminiQueue = new PQueue({
  concurrency: 1,
});

export function translateGemini(texts, language, priority, signal) {
  return translateGeminiQueue.add(
    () => pywebview.api.translate_gemini(texts, language),
    { priority, signal },
  );
}
