import { AppState } from '../../common/state';

export interface Reaction {
  init(state: AppState): void;
}
