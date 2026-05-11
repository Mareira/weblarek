import { Form } from './Form';

export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, onSubmit: (data: IContactsFormData) => void) {
    super(container, onSubmit);
    this._emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this._phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;

    this._emailInput.addEventListener('input', () => this.onInputChange());
    this._phoneInput.addEventListener('input', () => this.onInputChange());
  }

  protected getData(): IContactsFormData {
    return {
      email: this._emailInput.value,
      phone: this._phoneInput.value,
    };
  }

  private onInputChange(): void {
    this.onSubmit(this.getData());
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }
}