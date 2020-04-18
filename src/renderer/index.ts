import { ipcRenderer, remote } from 'electron';
import { applySnapshot } from 'mobx-state-tree';
import { AppState, AppStateSnapshot } from '../common/state';
import { TransparencyReaction } from './reactions/transparency';

export class MainWindowRenderer {
  private state?: AppState;

  public async main(): Promise<void> {
    ipcRenderer.send('mainStart');
    ipcRenderer.on('applyState', async (_event, state: AppStateSnapshot) => {
      if (!this.state) {
        this.state = AppState.create(state);
        await this.setupReactions(this.state);
      } else {
        applySnapshot(this.state, state);
      }
    });
  }

  private async setupReactions(state: AppState): Promise<void> {
    const transparencyReaction = new TransparencyReaction();
    transparencyReaction.init(state);
  }
}

const mainConsole: Console = remote.getGlobal('console');
new MainWindowRenderer().main().catch(mainConsole.error);
