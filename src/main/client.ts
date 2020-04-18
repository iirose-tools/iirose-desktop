import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  Rectangle,
  Tray
} from 'electron';
import contextMenu from 'electron-context-menu';
import ElectronStore from 'electron-store';
import * as fs from 'fs';
import * as _ from 'lodash';
import { autorun, observe } from 'mobx';
import { getSnapshot } from 'mobx-state-tree';
import * as path from 'path';
import { AppState, AppStateSnapshot } from '../common/state';
import { CONTEXT_MENU_OPTIONS } from './context-menu';

export class Client {
  private tray: Tray | null = null;
  private mainWindow: BrowserWindow | null = null;

  private readonly state: AppState;

  private readonly store = new ElectronStore<{
    windowBounds?: Rectangle;
    state?: AppStateSnapshot;
  }>();

  private readonly scripts = {
    mainRenderer: fs.readFileSync(
      path.resolve(__dirname, '../renderer/index.js'),
      'utf8'
    )
  };

  constructor() {
    const stateSnapshot = this.store.get('state');
    this.state = AppState.create(
      _.defaults(stateSnapshot, {
        alwaysOnTop: true,
        transparent: true
      })
    );
  }

  public async start(): Promise<void> {
    app.disableHardwareAcceleration();

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    await app.whenReady();

    this.createTray();
    await this.createWindow();

    this.setupIpc();
    this.setupReactions();
  }

  private createTray(): void {
    const iconPath = path.resolve(__dirname, '../assets/tray.ico');
    const icon = nativeImage.createFromPath(iconPath);

    this.tray = new Tray(icon);

    const menu = Menu.buildFromTemplate(this.getContextMenuOptions());

    this.tray.setContextMenu(menu);
    this.tray.setToolTip('IIROSE');
  }

  private async createWindow(): Promise<void> {
    this.mainWindow = new BrowserWindow({
      transparent: true,
      frame: false,
      fullscreenable: false,
      webPreferences: {
        nodeIntegration: true
      }
    });

    contextMenu({
      ...CONTEXT_MENU_OPTIONS,
      window: this.mainWindow,
      append: () => this.getContextMenuOptions()
    });

    const bounds = this.store.get('windowBounds');
    if (bounds) {
      this.mainWindow.setBounds(bounds);
    }

    this.mainWindow.webContents.on('did-start-navigation', () => {
      this.mainWindow!.webContents.executeJavaScript(this.scripts.mainRenderer);
    });

    this.mainWindow.on('close', () => {
      const snapshot = getSnapshot(this.state);
      this.store.set('state', snapshot);

      this.store.set('windowBounds', this.mainWindow!.getBounds());
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    await this.mainWindow.loadURL('https://iirose.com/');
  }

  private setupIpc(): void {
    ipcMain.on('mainStart', event => {
      event.reply('applyState', getSnapshot(this.state));
    });

    observe(this.state, () => {
      this.mainWindow!.webContents.send('applyState', getSnapshot(this.state));
    });
  }

  private setupReactions(): void {
    autorun(() => {
      const { alwaysOnTop } = this.state;

      this.mainWindow!.setAlwaysOnTop(alwaysOnTop);
      this.mainWindow!.setSkipTaskbar(alwaysOnTop);
    });
  }

  private getContextMenuOptions(): MenuItemConstructorOptions[] {
    return [
      {
        label: '置顶(&A)',
        type: 'checkbox',
        checked: this.state.alwaysOnTop,
        click: item => {
          this.state.setAlwaysOnTop(item.checked);
        }
      },
      {
        label: '启用透明模式(&T)',
        type: 'checkbox',
        checked: this.state.transparent,
        click: item => {
          this.state.setTransparent(item.checked);
        }
      },
      { type: 'separator' },
      {
        label: '退出(&Q)',
        click: () => {
          if (this.mainWindow) {
            this.mainWindow.close();
          }
        }
      }
    ];
  }
}
