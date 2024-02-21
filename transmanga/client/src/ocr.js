import { blobToBase64 } from "./blobToBase64";
import { cpuQueue } from "./cpuQueue";

export function ocr(image, priority, signal) {
  return cpuQueue.add(
    async () => pywebview.api.ocr(await blobToBase64(image)),
    { priority, signal },
  );
}
