import interact from "interactjs";
import { Show, createEffect, createSignal } from "solid-js";
import { fitText } from "./fitText";
import { ocrTextBox } from "./ocrTextBox";
import { state } from "./state";
import { TextBoxMenu } from "./TextBoxMenu";

export function TextBox(props) {
  const textContent = () => props.textBox.translation || props.textBox.text;
  let ref;
  createEffect(() => {
    if (!textContent()) return;
    //react when position changes
    props.textBox.position;
    fitText(ref);
  });

  const [menu, setMenu] = createSignal();

  return (
    <div
      lang={state.language}
      style={{
        position: "absolute",
        left: props.textBox.position.x * 100 + "%",
        top: props.textBox.position.y * 100 + "%",
        width: props.textBox.position.width * 100 + "%",
        height: props.textBox.position.height * 100 + "%",
        border: "1px solid blue",
        background: textContent() && "white",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "overflow-wrap": "anywhere",
        hyphens: "auto",
        "touch-action": "none",
        "user-select": "none",
      }}
      ref={(node) => {
        interact(node)
          .on("dragstart", () => (props.textBox.text = undefined))
          .on("dragend", () => ocrTextBox(props.textBox))
          .draggable({
            listeners: {
              move(e) {
                const { x, y, width, height } = props.textBox.position;
                const { clientWidth: parentWidth, clientHeight: parentHeight } =
                  node.parentElement;
                props.textBox.position = {
                  x: x + e.dx / parentWidth,
                  y: y + e.dy / parentHeight,
                  width,
                  height,
                };
              },
            },
          })
          .on("resizestart", () => (props.textBox.text = undefined))
          .on("resizeend", () => ocrTextBox(props.textBox))
          .resizable({
            edges: { top: true, left: true, bottom: true, right: true },
            listeners: {
              move(e) {
                const { x, y } = props.textBox.position;
                const { clientWidth: parentWidth, clientHeight: parentHeight } =
                  node.parentElement;
                props.textBox.position = {
                  x: x + e.deltaRect.left / parentWidth,
                  y: y + e.deltaRect.top / parentHeight,
                  width: e.rect.width / parentWidth,
                  height: e.rect.height / parentHeight,
                };
              },
            },
          });
        ref = node;
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenu(e);
      }}
    >
      {textContent()}
      <Show when={menu()}>
        <TextBoxMenu
          textBox={props.textBox}
          position={menu()}
          onClose={() => setMenu()}
        />
      </Show>
    </div>
  );
}
