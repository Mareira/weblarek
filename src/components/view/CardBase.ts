import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

export interface ICardActions {
  onClick?: () => void;
}

export abstract class CardBase extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement, protected actions?: ICardActions) {
    super(container);
    this._title = ensureElement('.card__title', container);
    this._price = ensureElement('.card__price', container);

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
}