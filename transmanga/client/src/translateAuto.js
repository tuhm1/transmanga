import swal from "sweetalert";
import { detect } from "./detect";
import { ocrTextBox } from "./ocrTextBox";
import { state } from "./state";
import { translateText } from "./translateText";

export function translateAuto() {
  state.images.forEach(async (image, imageIndex) => {
    const priority = () => -imageIndex * 1000000000;

    const { detections } = await detect(image.file, priority());
    detections.forEach(
      ({ bounding_box: { origin_x, origin_y, width, height } }) => {
        image.textBoxes.push({
          position: {
            x: origin_x / image.htmlElement.naturalWidth,
            y: origin_y / image.htmlElement.naturalHeight,
            width: width / image.htmlElement.naturalWidth,
            height: height / image.htmlElement.naturalHeight,
          },
          image: image,
        });
      },
    );
    image.textBoxes.sort((a, b) => a.position.y - b.position.y);

    await Promise.all(
      image.textBoxes.map(async (textBox) => {
        const priority = () => -imageIndex * 1000000000 - textBox.position.y;
        await ocrTextBox(textBox, priority());
      }),
    );

    try {
      await translateText(image, priority());
    } catch (e) {
      swal("Error", e.message, "error");
    }
  });
}
