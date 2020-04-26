export function injectCss(
  css: string,
  doc: HTMLDocument = document
): HTMLStyleElement {
  const style = doc.createElement('style');
  style.innerText = css;

  return doc.head.appendChild(style);
}
