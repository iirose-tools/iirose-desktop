import { Instance, types } from 'mobx-state-tree';

export type AppState = Instance<typeof AppState>;

export const AppState = types
  .model({
    alwaysOnTop: types.boolean,
    transparent: types.boolean
  })
  .actions(self => ({
    setAlwaysOnTop: (value: boolean) => {
      self.alwaysOnTop = value;
    },
    setTransparent: (value: boolean) => {
      self.transparent = value;
    }
  }));
