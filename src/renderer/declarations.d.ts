declare const mainFrame: any;

interface Window {
  ipcRenderer: Electron.IpcRenderer;
  _transparent: boolean;
}
