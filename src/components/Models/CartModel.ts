import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartModel {
  protected _items: IProduct[] = [];

  constructor(protected events: EventEmitter) {}

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this._items.push(product);
      this.events.emit('cart:changed', { items: this._items });
      this.events.emit('cart:countChanged', { count: this.getCount() });
    }
  }

  removeItem(id: string): void {
    this._items = this._items.filter(item => item.id !== id);
    this.events.emit('cart:changed', { items: this._items });
    this.events.emit('cart:countChanged', { count: this.getCount() });
  }

  clear(): void {
    this._items = [];
    this.events.emit('cart:changed', { items: this._items });
    this.events.emit('cart:countChanged', { count: this.getCount() });
  }

  getTotalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}