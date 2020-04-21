declare const mainFrame: HTMLIFrameElement;

interface Window {
  ipcRenderer: Electron.IpcRenderer;
  _transparent: boolean;
}
