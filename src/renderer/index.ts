import { ipcRenderer, remote } from 'electron';
import { applySnapshot } from 'mobx-state-tree';
import { AppState, AppStateSnapshot } from '../common/state';
import { DanmakuReaction, TransparencyReaction } from './reactions';

export class MainWindowRenderer {
  private state?: AppState;

  public async main(): Promise<void> {
    ipcRenderer.removeAllListeners('applyState');
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

  private setupReactions(state: AppState): void {
    const reactions = [new DanmakuReaction(), new TransparencyReaction()];
    reactions.forEach(reaction => reaction.init(state));
  }
}

const mainConsole: Console = remote.getGlobal('console');
new MainWindowRenderer().main().catch(mainConsole.error);
