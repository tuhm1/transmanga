export function fitText(node) {
  let l = 10,
    r = node.clientHeight;
  while (l < r) {
    let m = Math.floor((l + r) / 2);
    node.style.fontSize = m + "px";
    if (
      node.scrollWidth <= node.clientWidth &&
      node.scrollHeight <= node.clientHeight
    )
      l = m + 1;
    else r = m;
  }
  node.style.fontSize = --l + "px";
}
