import { Form } from './Form';
import { TPayment } from '../../types';

export interface IOrderFormData {
  payment: TPayment;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;
  protected _addressInput: HTMLInputElement;

  constructor(
    container: HTMLElement,
    onInputChange: (data: Partial<IOrderFormData>) => void,
    onSubmit: () => void
  ) {
    super(container, onSubmit);
    this._paymentButtons = container.querySelectorAll('.button_alt');
    this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const value = button.getAttribute('name');
        if (value === 'card' || value === 'cash') {
          onInputChange({ payment: value as TPayment });
        }
      });
    });

    this._addressInput.addEventListener('input', () => {
      onInputChange({ address: this._addressInput.value });
    });
  }

  getData(): IOrderFormData {
    let selectedPayment: TPayment = null;
    this._paymentButtons.forEach(button => {
      if (button.classList.contains('button_alt-active')) {
        selectedPayment = button.getAttribute('name') as TPayment;
      }
    });
    return {
      payment: selectedPayment,
      address: this._addressInput.value,
    };
  }

  set payment(value: TPayment) {
    this._paymentButtons.forEach(button => {
      if (value !== null && button.getAttribute('name') === value) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }
}