import { For } from "solid-js";
import swal from "sweetalert";
import { RectangleSelect } from "./RectangleSelect";
import { TextBox } from "./TextBox";
import { ocrTextBox } from "./ocrTextBox";
import { translateText } from "./translateText";

export function TranslateImage(props) {
  const addTextBox = (position) => {
    props.image.textBoxes.push({ position, image: props.image });
    ocrTextBox(props.image.textBoxes.at(-1));
  };

  let translationDialogRef;
  let textsRef;
  let translationsRef;

  const onSetTranslations = (e) => {
    e.preventDefault();
    const texts = textsRef.value.split("\n");
    props.image.textBoxes.forEach((textBox, index) => {
      textBox.text = texts[index];
    });
    const translations = translationsRef.value.split("\n");
    props.image.textBoxes.forEach((textBox, index) => {
      textBox.translation = translations[index];
    });
    translationDialogRef.close();
  };

  return (
    <div>
      <div style={{ position: "relative" }}>
        <img
          src={props.image.url}
          style={{ display: "block", width: "100%" }}
        />
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
          {(textBox) => <TextBox textBox={textBox} />}
        </For>
      </div>
      <div>
        <button
          onClick={() =>
            translateText(props.image).catch((e) =>
              swal("Error", e.message, "error"),
            )
          }
        >
          Translate text
        </button>
        <button
          onClick={() => {
            translationDialogRef.showModal();
            translationsRef.focus();
          }}
        >
          Set translation
        </button>
      </div>
      <dialog ref={translationDialogRef} style={{ width: "800px" }}>
        <form onSubmit={onSetTranslations}>
          <h3>Translation</h3>
          <div>
            <div>
              <label>Texts</label>
            </div>
            <div>
              <textarea
                ref={textsRef}
                value={props.image.textBoxes
                  .map((textBox) => textBox.text)
                  .join("\n")}
                rows={props.image.textBoxes.length}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    props.image.textBoxes
                      .map((textBox) => textBox.text)
                      .join("\n"),
                  );
                }}
                type="button"
              >
                Copy text
              </button>
            </div>
          </div>
          <div>
            <div>
              <label>Translations</label>
            </div>
            <div>
              <textarea
                value={props.image.textBoxes
                  .map((textBox) => textBox.translation)
                  .join("\n")}
                ref={translationsRef}
                rows={props.image.textBoxes.length}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div>
            <button>Apply</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
