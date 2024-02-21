export function TextBoxMenu(props) {
  return (
    <div
      ref={(node) => {
        document.addEventListener("click", function onClick(e) {
          if (!node.contains(e.target)) {
            document.removeEventListener("click", onClick);
            props.onClose();
          }
        });
      }}
      style={{
        position: "absolute",
        left: props.position.layerX + "px",
        top: props.position.layerY + "px",
        display: "flex",
      }}
    >
      <button
        onClick={() => {
          props.textBox.image.textBoxes = props.textBox.image.textBoxes.filter(
            (element) => element !== props.textBox,
          );
          props.onClose();
        }}
        style={{ width: "max-content" }}
      >
        Delete
      </button>
    </div>
  );
}
