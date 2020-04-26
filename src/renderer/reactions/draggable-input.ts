import { autorun } from 'mobx';
import { AppState } from '../../common/state';
import { injectCss } from '../utils/inject-css';
import { Reaction } from './reaction';

export class DraggableInputReaction implements Reaction {
  private unset: (() => void) | null = null;

  public init(state: AppState): void {
    autorun(() => {
      const { danmaku } = state;
      if (danmaku) {
        this.setDraggableInput();
      } else {
        this.unsetDraggableInput();
      }
    });
  }

  private setDraggableInput(): void {
    if (!this.unset) {
      const doc = mainFrame.contentDocument;

      if (doc) {
        const element = doc.getElementById('moveinputDisplay')!;

        const unmake = this.makeElementDraggable(doc, element);
        const cssElement = this.changeInputDisplayStyle();

        this.unset = () => {
          unmake();
          cssElement.remove();
        };
      }
    }
  }

  private unsetDraggableInput(): void {
    if (this.unset) {
      this.unset();
      this.unset = null;
    }
  }

  private makeElementDraggable(
    doc: HTMLDocument,
    element: HTMLElement
  ): () => void {
    let lastPos: [number, number] | null = null;

    const onDrag = (e: MouseEvent) => {
      e.preventDefault();

      const [x, y] = lastPos!;

      const newX = x - e.clientX;
      const newY = y - e.clientY;

      lastPos = [e.clientX, e.clientY];

      element.style.left = element.offsetLeft - newX + 'px';
      element.style.top = element.offsetTop - newY + 'px';
    };

    const onMouseUp = () => {
      doc.removeEventListener('mouseup', onMouseUp);
      doc.removeEventListener('mousemove', onDrag);
    };

    const onMouseDown = (e: MouseEvent) => {
      lastPos = [e.clientX, e.clientY];

      doc.addEventListener('mouseup', onMouseUp);
      doc.addEventListener('mousemove', onDrag);
    };

    element.addEventListener('mousedown', onMouseDown);

    return () => {
      element.style.removeProperty('left');
      element.style.removeProperty('top');

      element.removeEventListener('mousedown', onMouseDown);
    };
  }

  private changeInputDisplayStyle(): HTMLStyleElement {
    return injectCss(
      '#moveinputDisplay{display:flex;flex-direction:row}#moveinputBubble{position:relative}.moveinputSendBtn{position:relative}',
      mainFrame.contentDocument!
    );
  }
}
