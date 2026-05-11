import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Header extends Component<{ counter: number }> {
  protected _cartButton: HTMLButtonElement;
  protected _cartCounter: HTMLElement;

  constructor(container: HTMLElement, onCartClick: () => void) {
    super(container);
    this._cartButton = ensureElement<HTMLButtonElement>('.header__basket', container);
    this._cartCounter = ensureElement('.header__basket-counter', container);

    this._cartButton.addEventListener('click', onCartClick);
  }

  set counter(value: number) {
    this._cartCounter.textContent = String(value);
  }
}