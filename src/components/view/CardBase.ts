import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';
import { IProduct } from '../../types';

export interface ICardActions {
  onClick?: () => void;
  onButtonClick?: () => void;
}

export abstract class CardBase extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(container: HTMLElement, protected actions?: ICardActions) {
    super(container);
    this._title = container.querySelector('.card__title') as HTMLElement;
    this._price = container.querySelector('.card__price') as HTMLElement;
    this._image = container.querySelector('.card__image') as HTMLImageElement;
    this._category = container.querySelector('.card__category') as HTMLElement;
    this._button = container.querySelector('.card__button') as HTMLButtonElement;

    if (this._button && actions?.onButtonClick) {
      this._button.addEventListener('click', actions.onButtonClick);
    }
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set title(value: string) {
    if (this._title) this._title.textContent = value;
  }

  set price(value: number | null) {
    if (this._price) {
      if (value === null) {
        this._price.textContent = 'Бесценно';
        if (this._button) {
          this._button.disabled = true;
          this._button.textContent = 'Недоступно';
        }
      } else {
        this._price.textContent = `${value} синапсов`;
        if (this._button) {
          this._button.disabled = false;
        }
      }
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
    if (this._button && value) {
      this._button.textContent = value;
    }
  }

  set buttonDisabled(value: boolean) {
    if (this._button) {
      this._button.disabled = value;
    }
  }
}