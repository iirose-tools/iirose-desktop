import { Options } from 'electron-context-menu';

export const CONTEXT_MENU_OPTIONS: Options = {
  menu: actions => [
    actions.separator(),
    actions.cut({}),
    actions.copy({}),
    actions.paste({}),
    actions.separator(),
    actions.saveImageAs({}),
    actions.copyImage({}),
    actions.copyImageAddress({}),
    actions.separator(),
    actions.copyLink({}),
    actions.separator()
  ],
  labels: {
    cut: '剪切（&T）',
    copy: '复制（&C）',
    paste: '粘贴（&P）',
    saveImageAs: '图片另存为（&V）',
    copyLink: '复制链接地址（&E）',
    copyImage: '复制图片（&Y）',
    copyImageAddress: '复制图片地址（&O）'
  }
};
