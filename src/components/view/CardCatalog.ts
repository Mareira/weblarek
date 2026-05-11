import { CardBase, ICardActions } from './CardBase';

export class CardCatalog extends CardBase {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
  }
}