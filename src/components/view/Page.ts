import { Component } from '../base/Component';

export class Page extends Component<{ catalog: HTMLElement[]; cartCounter: number; locked: boolean }> {
  protected _gallery: HTMLElement;
  protected _cartCounter: HTMLElement;
  protected _cartButton: HTMLButtonElement;
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement, onCartClick: () => void) {
    super(container);
    this._gallery = container.querySelector('.gallery') as HTMLElement;
    this._cartCounter = container.querySelector('.header__basket-counter') as HTMLElement;
    this._cartButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this._wrapper = container.querySelector('.page__wrapper') as HTMLElement;

    if (this._cartButton) {
      this._cartButton.addEventListener('click', onCartClick);
    }
  }

  set catalog(items: HTMLElement[]) {
    if (this._gallery) {
      this._gallery.innerHTML = '';
      items.forEach(item => this._gallery.appendChild(item));
    }
  }

  set cartCounter(value: number) {
    if (this._cartCounter) {
      this._cartCounter.textContent = String(value);
    }
  }

  set locked(value: boolean) {
    if (this._wrapper) {
      if (value) {
        this._wrapper.classList.add('page__wrapper_locked');
      } else {
        this._wrapper.classList.remove('page__wrapper_locked');
      }
    }
  }
}