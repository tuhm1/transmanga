import { saveAs } from "file-saver";
import JSZip from "jszip";
import { exportImage } from "./exportImage";

export async function exportImages(images) {
  const zip = new JSZip();
  for (let index = 0; index < images.length; index++) {
    const imageBlob = await exportImage(images[index]);
    const name = index.toString().padStart(10, "0") + ".png";
    zip.file(name, imageBlob);
  }
  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "transmanga.zip");
}
