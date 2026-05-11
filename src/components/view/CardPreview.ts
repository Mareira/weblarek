import { CardBase, ICardActions } from './CardBase';

export class CardPreview extends CardBase {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._description = container.querySelector('.card__text') as HTMLElement;
  }

  set description(value: string) {
    if (this._description) this._description.textContent = value;
  }
}