import { state } from "./state";
import { translators } from "./translators";

export async function translateText(image, priority, signal) {
  const texts = image.textBoxes.map((textBox) => textBox.text);
  const translations = await translators[state.translator](
    texts,
    state.language,
    priority,
    signal,
  );
  image.textBoxes.forEach((textBox, index) => {
    textBox.translation = translations[index];
  });
}
