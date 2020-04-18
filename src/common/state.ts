import { Instance, types } from 'mobx-state-tree';

export type AppState = Instance<typeof AppState>;

export const AppState = types
  .model({
    transparent: types.boolean
  })
  .actions(self => ({
    setTransparent: (value: boolean) => {
      self.transparent = value;
    }
  }));
