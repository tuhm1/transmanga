import { For, createEffect, onCleanup } from "solid-js";
import { detect } from "./detect";
import { translators } from "./translators";
import { TextBox } from "./TextBox";
import { RectangleSelect } from "./RectangleSelect";
import swal from "sweetalert";

export function TranslateImage(props) {
  const addTextBox = (position) => {
    props.image.textBoxes.push({ position, image: props.image });
    props.image.textBoxes.sort((a, b) => a.position.y - b.position.y);
  };
  const priority = () => -props.image.index * 1000000000;

  createEffect(() => {
    const controller = new AbortController();
    props.image.url = URL.createObjectURL(props.image.file);
    props.image.textBoxes = [];
    props.image.htmlElement = document.createElement("img");
    props.image.htmlElement.src = props.image.url;
    props.image.htmlElement.onload = async () => {
      const { detections } = await detect(
        props.image.file,
        priority(),
        controller.signal,
      );
      detections.forEach(
        ({ bounding_box: { origin_x, origin_y, width, height } }) => {
          addTextBox({
            x: origin_x / props.image.htmlElement.naturalWidth,
            y: origin_y / props.image.htmlElement.naturalHeight,
            width: width / props.image.htmlElement.naturalWidth,
            height: height / props.image.htmlElement.naturalHeight,
          });
        },
      );
    };
    onCleanup(() => controller.abort());
  });

  createEffect(() => {
    if (
      props.image.textBoxes.length === 0 ||
      props.image.textBoxes.some((textBox) => textBox.text === undefined)
    )
      return;
    const abortController = new AbortController();
    const texts = props.image.textBoxes.map((textBox) => textBox.text);
    translators[props.translator](
      texts,
      props.language,
      priority(),
      abortController.signal,
    )
      .then((translations) => {
        props.image.textBoxes.forEach((textBox, index) => {
          textBox.translation = translations[index];
        });
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        swal("Error", e.message, "error");
      });
    onCleanup(() => abortController.abort());
  });

  return (
    <div style={{ position: "relative" }}>
      <img src={props.image.url} style={{ display: "block", width: "100%" }} />
      <RectangleSelect
        onSelect={addTextBox}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <For each={props.image.textBoxes}>
        {(textBox) => <TextBox textBox={textBox} language={props.language} />}
      </For>
    </div>
  );
}
