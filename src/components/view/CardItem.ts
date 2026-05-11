import { CardBase, ICardActions } from './CardBase';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export abstract class CardItem extends CardBase {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement('.card__category', container);
  }

  set image(value: string) {
    if (this._image && value) {
      this._image.src = value;
      this._image.alt = this._title?.textContent || '';
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      const modifier = categoryMap[value as keyof typeof categoryMap];
      if (modifier) {
        this._category.classList.add(modifier);
      }
    }
  }
}