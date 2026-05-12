import { CardItem, ICardItemActions } from './CardItem';

export class CardPreview extends CardItem {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardItemActions) {
    super(container, actions);
    this._description = container.querySelector('.card__text') as HTMLElement;
  }

  set description(value: string) {
    if (this._description) this._description.textContent = value;
  }
}