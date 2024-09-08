import { cropImage } from "./cropImage";
import { ocr } from "./ocr";

export async function ocrTextBox(textBox, priority, signal) {
  const cropped = await cropImage(textBox.image.htmlElement, textBox.position);
  textBox.text = await ocr(cropped, priority, signal);
}
