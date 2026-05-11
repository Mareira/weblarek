import { Component } from '../base/Component';

export class Cart extends Component<{ items: HTMLElement[]; total: number; buttonDisabled?: boolean }> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, onCheckout: () => void) {
    super(container);
    this._list = container.querySelector('.basket__list') as HTMLElement;
    this._total = container.querySelector('.basket__price') as HTMLElement;
    this._button = container.querySelector('.basket__button') as HTMLButtonElement;

    if (this._button) {
      this._button.addEventListener('click', onCheckout);
    }
  }

  set items(items: HTMLElement[]) {
    if (this._list) {
      if (items.length === 0) {
        this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
        if (this._button) this._button.disabled = true;
      } else {
        this._list.innerHTML = '';
        items.forEach(item => this._list.appendChild(item));
        if (this._button) this._button.disabled = false;
      }
    }
  }

  set total(value: number) {
    if (this._total) {
      this._total.textContent = `${value} синапсов`;
    }
  }
}