import { Form } from './Form';

export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(
    container: HTMLElement,
    onInputChange: (data: Partial<IContactsFormData>) => void,
    onSubmit: () => void
  ) {
    super(container, onSubmit);
    this._emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this._phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;

    this._emailInput.addEventListener('input', () => {
      onInputChange({ email: this._emailInput.value });
    });

    this._phoneInput.addEventListener('input', () => {
      onInputChange({ phone: this._phoneInput.value });
    });
  }

  getData(): IContactsFormData {
    return {
      email: this._emailInput.value,
      phone: this._phoneInput.value,
    };
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }
}