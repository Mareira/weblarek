import { CardBase, ICardActions } from './CardBase';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends CardBase {
  protected _index: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, onRemove: () => void) {
    super(container);
    this._index = ensureElement('.basket__item-index', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
    this._button.addEventListener('click', (e) => {
      e.stopPropagation();
      onRemove();
    });
  }

  set price(value: string) {
    this._price.textContent = value;
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}