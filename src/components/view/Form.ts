import { Component } from '../base/Component';

export abstract class Form<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLElement, protected onSubmit: (data: T) => void) {
    super(container);
    this._form = container as HTMLFormElement;
    this._submitButton = container.querySelector('.order__button, .button') as HTMLButtonElement;
    this._errors = container.querySelector('.form__errors') as HTMLElement;

    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit(this.getData());
    });
  }

  protected abstract getData(): T;

  set valid(value: boolean) {
  // Не трогаем кнопки выбора оплаты, только кнопку отправки формы
  if (this._submitButton && !this._submitButton.classList.contains('button_alt')) {
    this._submitButton.disabled = !value;
  }
}

  set errors(value: string) {
    if (this._errors) {
      this._errors.textContent = value;
    }
  }

  render(data: Partial<T>): HTMLElement {
    Object.assign(this as object, data);
    return this.container;
  }
}