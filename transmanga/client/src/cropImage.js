export async function cropImage(image, position) {
  const canvas = document.createElement("canvas");
  canvas.width = position.width * image.naturalWidth;
  canvas.height = position.height * image.naturalHeight;
  const context = canvas.getContext("2d");
  context.drawImage(
    image,
    position.x * image.naturalWidth,
    position.y * image.naturalHeight,
    position.width * image.naturalWidth,
    position.height * image.naturalHeight,
    0,
    0,
    position.width * image.naturalWidth,
    position.height * image.naturalHeight,
  );
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
}
