import { Instance, IStateTreeNode, IType, types } from 'mobx-state-tree';

export type AppState = Instance<typeof AppState>;

export type AppStateSnapshot = AppState extends IStateTreeNode<
  IType<infer T, any, any>
>
  ? T
  : never;

export const AppState = types
  .model({
    alwaysOnTop: types.boolean,
    danmaku: types.boolean,
    transparent: types.boolean
  })
  .actions(self => ({
    setAlwaysOnTop: (value: boolean) => {
      self.alwaysOnTop = value;
    },
    setDanmaku: (value: boolean) => {
      self.danmaku = value;
    },
    setTransparent: (value: boolean) => {
      self.transparent = value;
    }
  }));
