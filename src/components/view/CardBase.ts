import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

export interface ICardActions {
  onClick?: () => void;
  onButtonClick?: () => void;
}

export abstract class CardBase extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(container: HTMLElement, protected actions?: ICardActions) {
    super(container);
    this._title = ensureElement('.card__title', container);
    this._price = ensureElement('.card__price', container);
    // Кнопка может отсутствовать, поэтому оставляем as (или можно использовать ensureElement с try/catch)
    const button = container.querySelector('.card__button, .basket__item-delete');
    this._button = button as HTMLButtonElement;

    if (this._button && actions?.onButtonClick) {
      this._button.addEventListener('click', (e) => {
        e.stopPropagation();
        actions.onButtonClick!();
      });
    }
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: string) {
    this._price.textContent = value;
  }

  set buttonText(value: string) {
    if (this._button) this._button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    if (this._button) this._button.disabled = value;
  }
}