import { autorun } from 'mobx';
import { AppState } from '../../common/state';
import { injectCss } from '../utils/inject-css';
import { Reaction } from './reaction';

export class TransparencyReaction implements Reaction {
  private unset: (() => void) | null = null;

  public init(state: AppState): void {
    autorun(() => {
      const { transparent } = state;
      if (transparent) {
        this.setTransparent();
      } else {
        this.unsetTransparent();
      }
    });
  }

  private setTransparent(): void {
    if (!this.unset) {
      const documentCss = '#mainFrame,body{background-color:#0000!important}';
      const mainFrameCss =
        '#bodyBG,#msgholderDisplay>div:nth-child(1){visibility:hidden}';

      const documentCssElement = injectCss(documentCss);
      const mainFrameCssElement = injectCss(
        mainFrameCss,
        mainFrame.contentDocument!
      );

      this.unset = () => {
        documentCssElement.remove();
        mainFrameCssElement.remove();
      };
    }
  }

  private unsetTransparent(): void {
    if (this.unset) {
      this.unset();
      this.unset = null;
    }
  }
}
