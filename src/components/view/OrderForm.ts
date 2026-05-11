import { Form } from './Form';
import { TPayment } from '../../types';

export interface IOrderFormData {
  payment: TPayment;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;
  protected _addressInput: HTMLInputElement;
  protected _nextButton: HTMLButtonElement;

  constructor(container: HTMLElement, onSubmit: (data: IOrderFormData) => void) {
    super(container, onSubmit);
    this._paymentButtons = container.querySelectorAll('.button_alt');
    this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
    this._nextButton = container.querySelector('.order__button') as HTMLButtonElement;

    // Настройка кнопок выбора оплаты
    this._paymentButtons.forEach(button => {
      // Убираем disabled и класс disabled, если они есть
      button.disabled = false;
      button.classList.remove('disabled');
      
      button.addEventListener('click', () => {
        const value = button.getAttribute('name');
        if (value === 'card' || value === 'cash') {
          // Убираем активный класс со всех кнопок
          this._paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
          // Добавляем активный класс на выбранную
          button.classList.add('button_alt-active');
          // Сохраняем данные
          this.onSubmit(this.getData());
        }
      });
    });

    // Изменение адреса
    this._addressInput.addEventListener('input', () => {
      this.onSubmit(this.getData());
    });
  }

  protected getData(): IOrderFormData {
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
      if (button.getAttribute('name') === value) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  set valid(value: boolean) {
    if (this._nextButton) {
      this._nextButton.disabled = !value;
    }
  }

  set errors(value: string) {
    const errorsElement = this.container.querySelector('.form__errors') as HTMLElement;
    if (errorsElement) {
      errorsElement.textContent = value;
    }
  }
}