export function injectCss(css: string): HTMLStyleElement {
  const style = document.createElement('style');
  style.innerText = css;

  return mainFrame.contentDocument!.head.appendChild(style);
}
