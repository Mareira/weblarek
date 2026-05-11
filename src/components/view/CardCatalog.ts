import { CardItem } from './CardItem';

export class CardCatalog extends CardItem {
  constructor(container: HTMLElement, actions?: { onClick: () => void }) {
    super(container, actions);
  }
}