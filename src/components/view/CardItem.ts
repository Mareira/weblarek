import { CardBase, ICardActions } from './CardBase';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export interface ICardItemActions extends ICardActions {
  onButtonClick?: () => void;
}

export abstract class CardItem extends CardBase {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardItemActions) {
    super(container, actions);
    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement('.card__category', container);
    
    const button = container.querySelector('.card__button, .basket__item-delete');
    this._button = button as HTMLButtonElement;

    if (this._button && actions?.onButtonClick) {
      this._button.addEventListener('click', (e) => {
        e.stopPropagation();
        actions.onButtonClick!();
      });
    }
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

  set buttonText(value: string) {
    if (this._button) this._button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    if (this._button) this._button.disabled = value;
  }
}