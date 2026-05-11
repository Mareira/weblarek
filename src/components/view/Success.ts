import { Component } from '../base/Component';

export class Success extends Component<{ total: number }> {
  protected _closeButton: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);
    this._closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
    this._total = container.querySelector('.order-success__description') as HTMLElement;

    this._closeButton.addEventListener('click', onClose);
  }

  set total(value: number) {
    if (this._total) {
      this._total.textContent = `Списано ${value} синапсов`;
    }
  }
}