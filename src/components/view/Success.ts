import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<{ total: number }> {
  protected _closeButton: HTMLButtonElement;
  protected _total: HTMLElement;
  protected _onClose: () => void;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);
    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this._total = ensureElement('.order-success__description', container);
    this._onClose = onClose;

    this._closeButton.addEventListener('click', () => {
      this._onClose();
    });
  }

  set total(value: number) {
    this._total.textContent = `Списано ${value} синапсов`;
  }
}