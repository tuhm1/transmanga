import interact from "interactjs";
import { Show, createEffect, createSignal, onCleanup } from "solid-js";
import { ocr } from "./ocr";
import { fitText } from "./fitText";
import { cropImage } from "./cropImage";
import { TextBoxMenu } from "./TextBoxMenu";

export function TextBox(props) {
  const [settled, setSettled] = createSignal(true);
  const priority = () =>
    -props.textBox.image.index * 1000000000 - props.textBox.position.y;

  createEffect(() => {
    props.textBox.text = props.textBox.translation = undefined;
    if (!settled()) return;
    const controller = new AbortController();
    cropImage(props.textBox.image.htmlElement, props.textBox.position).then(
      async (cropped) => {
        props.textBox.text = await ocr(cropped, priority(), controller.signal);
      },
    );
    onCleanup(() => controller.abort());
  });

  const textContent = () => props.textBox.translation || props.textBox.text;
  let ref;
  createEffect(() => textContent() && fitText(ref));

  const [menu, setMenu] = createSignal();

  return (
    <div
      lang={props.language}
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
          .on("dragstart", () => setSettled(false))
          .on("dragend", () => setSettled(true))
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
          .on("resizestart", () => setSettled(false))
          .on("resizeend", () => setSettled(true))
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
