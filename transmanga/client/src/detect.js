import { blobToBase64 } from "./blobToBase64";
import { cpuQueue } from "./cpuQueue";

export function detect(image, priority, signal) {
  return cpuQueue.add(
    async () => pywebview.api.detect(await blobToBase64(image)),
    { priority, signal },
  );
}
