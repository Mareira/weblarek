import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Cart extends Component<{
  items: HTMLElement[];
  total: number;
}> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, onCheckout: () => void) {
    super(container);
    this._list = ensureElement(".basket__list", container);
    this._total = ensureElement(".basket__price", container);
    this._button = ensureElement<HTMLButtonElement>(".basket__button", container);

    this._button.addEventListener("click", onCheckout);
    this._button.disabled = true;
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
      this._button.disabled = true;
    } else {
      this._list.innerHTML = "";
      items.forEach((item) => this._list.appendChild(item));
      this._button.disabled = false;
    }
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }
}