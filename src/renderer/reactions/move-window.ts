import { observe } from 'mobx';
import { AppState } from '../../common/state';
import { Reaction } from './reaction';

export class MoveWindowReaction implements Reaction {
  private dragContainer: HTMLElement | null = null;

  public init(state: AppState): void {
    observe(state, 'moveWindow', () => {
      if (!this.dragContainer) {
        this.dragContainer = this.createDragContainer(() => {
          this.dragContainer!.remove();
          this.dragContainer = null;
        });
      }
    });
  }

  private createDragContainer(onFinish: () => void): HTMLElement {
    const container = document.createElement('div');

    const dragIcon = this.createDragIcon();
    container.appendChild(dragIcon);

    const finishButton = this.createFinishButton(onFinish);
    container.appendChild(finishButton);

    return mainFrame.contentDocument!.body.appendChild(container);
  }

  private createDragIcon(): HTMLElement {
    const dragIcon = document.createElement('button');
    dragIcon.className = 'mdi mdi-arrow-all';

    dragIcon.style.position = 'absolute';
    dragIcon.style.fontSize = '50px';
    dragIcon.style.color = '#fff';
    dragIcon.style.top = '50%';
    dragIcon.style.left = '50%';
    dragIcon.style.marginTop = '-25px';
    dragIcon.style.marginLeft = '-25px';
    dragIcon.style.zIndex = '2147483647';
    dragIcon.style.textShadow =
      '0 0 2px rgba(0,0,0,0.48), 0 2px 2px rgba(0,0,0,0.96)';

    (dragIcon.style as any).webkitAppRegion = 'drag';

    return dragIcon;
  }

  private createFinishButton(onClick: () => void): HTMLElement {
    const finishButton = document.createElement('button');

    finishButton.className = 'mdi mdi-checkbox-marked-circle';
    finishButton.onclick = onClick;

    finishButton.style.position = 'absolute';
    finishButton.style.fontSize = '20px';
    finishButton.style.color = '#2dc847e3';
    finishButton.style.left = '50%';
    finishButton.style.top = '50%';
    finishButton.style.marginLeft = '24px';
    finishButton.style.marginTop = '-5px';
    finishButton.style.zIndex = '2147483647';
    finishButton.style.textShadow =
      '0 0 1px rgba(0,0,0,0.24), 0 1px 1px rgba(0,0,0,0.48)';

    return finishButton;
  }
}
