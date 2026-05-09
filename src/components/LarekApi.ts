import { IApi, IProductsResponse } from '../types';

export class LarekApi {
  constructor(private api: IApi) {}

  // GET /product — получить товары с сервера
  getProducts(): Promise<IProductsResponse> {
    return this.api.get('/product');
  }

  // POST /order — отправить заказ
  sendOrder(order: object) {
    return this.api.post('/order', order);
  }
}