import { CardBase, ICardActions } from './CardBase';

export class CardBasket extends CardBase {
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._index = container.querySelector('.basket__item-index') as HTMLElement;
  }

  set index(value: number) {
    if (this._index) this._index.textContent = String(value);
  }
}