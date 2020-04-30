import { autorun } from 'mobx';
import { AppState } from '../../common/state';
import { injectCss } from '../utils/inject-css';
import { Reaction } from './reaction';

export class DanmakuReaction implements Reaction {
  private cssElement: HTMLStyleElement | null = null;

  public init(state: AppState): void {
    autorun(() => {
      const { danmaku } = state;
      if (danmaku) {
        this.setDanmakuMode();
      } else {
        this.unsetDanmakuMode();
      }
    });
  }

  private setDanmakuMode(): void {
    if (!this.cssElement) {
      this.cssElement = injectCss(
        '.msgholderBox{overflow-y:hidden}.msg{-webkit-animation:danmaku 15s linear 5,hide-danmaku 0s ease-in 75s forwards;transition:visibility 0s 2s,opacity 2s linear;float:right!important}.pubMsgTime{display:none}@-webkit-keyframes danmaku{0%{-webkit-transform:translateX(0)}100%{-webkit-transform:translateX(-125vw)}}@-webkit-keyframes hide-danmaku{to{width:0;height:0;visibility:hidden}}',
        mainFrame.contentDocument!
      );

      this.scrollToBottom();
    }
  }

  private unsetDanmakuMode(): void {
    if (this.cssElement) {
      this.cssElement.remove();
      this.cssElement = null;

      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    const messageBox = mainFrame.contentDocument!.getElementsByClassName(
      'msgholderBox'
    )[0];
    messageBox.scrollTo(0, messageBox.scrollHeight);
  }
}
