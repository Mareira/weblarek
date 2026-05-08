import { Api } from './base/Api';

export class LarekApi {
  constructor(private api: Api) {}

  // GET /product — получить товары с сервера
  getProducts() {
    return this.api.get('/product');
  }

  // POST /order — отправить заказ
  sendOrder(order: object) {
    return this.api.post('/order', order);
  }
}