import PQueue from "p-queue";
import { languages } from "./languages";

const translateCopilotQueue = new PQueue({ concurrency: 1 });

export async function translateCopilot(texts, language, priority, signal) {
  const MAX_TRIES = 5;
  for (let i = 1; i <= MAX_TRIES; i++) {
    try {
      return await translateCopilotQueue.add(
        () => pywebview.api.translate_copilot(texts, languages[language]),
        { priority, signal },
      );
    } catch (e) {
      if (e.name === "AbortError" || i === MAX_TRIES) {
        throw e;
      }
    }
  }
}
