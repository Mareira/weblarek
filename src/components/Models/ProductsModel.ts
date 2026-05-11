import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductsModel {
  protected _items: IProduct[] = [];
  protected _selectedProduct: IProduct | null = null;

  constructor(protected events: EventEmitter) {}

  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('products:changed', { items: this._items });
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getProductById(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
    this.events.emit('product:selected', { product: this._selectedProduct });
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}