import { Show, createSignal } from "solid-js";

export function RectangleSelect(props) {
  const [point1, setPoint1] = createSignal();
  const [point2, setPoint2] = createSignal();
  const relativePosition = (e) => {
    const rootRect = root.getBoundingClientRect();
    return {
      x: (e.x - rootRect.left) / root.clientWidth,
      y: (e.y - rootRect.top) / root.clientHeight,
    };
  };
  const selection = () => ({
    x: Math.min(point1().x, point2().x),
    y: Math.min(point1().y, point2().y),
    width: Math.abs(point1().x - point2().x),
    height: Math.abs(point1().y - point2().y),
  });
  let root;
  return (
    <div
      ref={root}
      onMouseMove={(e) => setPoint2(relativePosition(e))}
      onClick={(e) => {
        if (!point1()) {
          setPoint1(relativePosition(e));
        } else {
          props.onSelect(selection());
          setPoint1();
        }
      }}
      style={props.style}
    >
      <Show when={point1() && point2()}>
        <div
          style={{
            position: "absolute",
            left: selection().x * 100 + "%",
            top: selection().y * 100 + "%",
            width: selection().width * 100 + "%",
            height: selection().height * 100 + "%",
            border: "1px dashed blue",
          }}
        />
      </Show>
    </div>
  );
}
