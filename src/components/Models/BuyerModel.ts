import { IBuyer, TPayment, TBuyerValidationErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class BuyerModel {
  protected _payment: TPayment = null;
  protected _email: string = '';
  protected _phone: string = '';
  protected _address: string = '';

  constructor(protected events: EventEmitter) {}

  setData(data: Partial<IBuyer>): void {
    let changed = false;
    
    if (data.payment !== undefined && this._payment !== data.payment) {
      this._payment = data.payment;
      changed = true;
    }
    if (data.email !== undefined && this._email !== data.email) {
      this._email = data.email;
      changed = true;
    }
    if (data.phone !== undefined && this._phone !== data.phone) {
      this._phone = data.phone;
      changed = true;
    }
    if (data.address !== undefined && this._address !== data.address) {
      this._address = data.address;
      changed = true;
    }
    
    if (changed) {
      this.events.emit('buyer:changed', { data: this.getData() });
    }
  }

  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clear(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
    this.events.emit('buyer:changed', { data: this.getData() });
  }

  validate(): TBuyerValidationErrors {
    const errors: TBuyerValidationErrors = {};
    
    if (!this._payment) errors.payment = 'Не выбран вид оплаты';
    if (!this._email) errors.email = 'Укажите email';
    if (!this._phone) errors.phone = 'Укажите телефон';
    if (!this._address) errors.address = 'Укажите адрес';
    
    return errors;
  }
}