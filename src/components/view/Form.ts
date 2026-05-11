import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLElement, protected onSubmit: () => void) {
    super(container);
    this._form = container as HTMLFormElement;
    this._submitButton = ensureElement<HTMLButtonElement>('.order__button, .button', container);
    this._errors = ensureElement('.form__errors', container);

    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  abstract getData(): T;

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  set errors(value: string) {
    this._errors.textContent = value;
  }
}