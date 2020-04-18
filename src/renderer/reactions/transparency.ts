import { autorun } from 'mobx';
import { AppState } from '../../common/state';

export class TransparencyReaction {
  private bgStyleObserver: MutationObserver | null = null;

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
    this.makeElementTransparent(this.getBodyElement());
    this.makeElementTransparent(this.getMainFrameElement());

    const background = this.getBackgroundElement();
    this.makeElementHidden(background);

    if (!this.bgStyleObserver) {
      this.bgStyleObserver = new MutationObserver(() => {
        this.makeElementHidden(background);
      });

      this.bgStyleObserver.observe(background, {
        attributes: true,
        attributeFilter: ['style']
      });
    }
  }

  private unsetTransparent(): void {
    if (this.bgStyleObserver) {
      this.bgStyleObserver.disconnect();
      this.bgStyleObserver = null;

      this.makeElementVisible(this.getBodyElement());
      this.makeElementVisible(this.getMainFrameElement());

      const bodyBG = this.getBackgroundElement();
      bodyBG.style.visibility = null as any;
    }
  }

  private getBodyElement(): HTMLBodyElement {
    return document.getElementsByTagName('body')[0];
  }

  private getMainFrameElement(): HTMLElement {
    return document.getElementById('mainFrame')!;
  }

  private getBackgroundElement(): HTMLElement {
    return mainFrame.contentDocument.getElementById('bodyBG');
  }

  private makeElementTransparent(element: HTMLElement): void {
    element.style.backgroundColor = 'rgba(0,0,0,0)';
  }

  private makeElementHidden(element: HTMLElement): void {
    element.style.visibility = 'hidden';
  }

  private makeElementVisible(element: HTMLElement): void {
    element.style.opacity = '';
    element.style.backgroundColor = 'rgba(0,0,0)';
  }
}
