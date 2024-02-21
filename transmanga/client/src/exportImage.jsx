import { toBlob } from "html-to-image";
import { fitText } from "./fitText";

export async function exportImage(image) {
  let imgRef,
    textRefs = [];
  const html = (
    <div style={{ position: "relative", width: "fit-content" }}>
      <img src={image.url} style={{ display: "block" }} ref={imgRef} />
      {image.textBoxes.map((textBox, i) => (
        <div
          style={{
            position: "absolute",
            left: textBox.position.x * 100 + "%",
            top: textBox.position.y * 100 + "%",
            width: textBox.position.width * 100 + "%",
            height: textBox.position.height * 100 + "%",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            background: "white",
            "overflow-wrap": "anywhere",
            hyphens: "auto",
          }}
          ref={(ref) => (textRefs[i] = ref)}
        >
          {textBox.translation}
        </div>
      ))}
    </div>
  );
  document.body.append(html);
  await new Promise((resolve) => {
    imgRef.onload = resolve;
  });
  textRefs.forEach(fitText);
  const blob = await toBlob(html);
  html.remove();
  return blob;
}
