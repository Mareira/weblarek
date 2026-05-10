import { IBuyer, TPayment, TBuyerValidationErrors } from '../../types';

export class BuyerModel {
  protected payment: TPayment | null = null;
  protected email: string = '';
  protected phone: string = '';
  protected address: string = '';

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): TBuyerValidationErrors {
    const errors: TBuyerValidationErrors = {};
    
    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.email) errors.email = 'Укажите email';
    if (!this.phone) errors.phone = 'Укажите телефон';
    if (!this.address) errors.address = 'Укажите адрес';
    
    return errors;
  }
}