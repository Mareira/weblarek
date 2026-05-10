export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'cash' | 'card' | null;

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера при GET /product
export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

// Данные для отправки заказа на сервер (POST /order)
export interface IOrder {
    items: string[];    // массив ID товаров
    payment: TPayment;  // способ оплаты ('cash', 'card' или null)
    email: string;
    phone: string;
    address: string;
    total: number;      // итоговая сумма заказа
}

// Ответ сервера после успешного создания заказа (POST /order)
export interface IOrderResult {
    id: string;   // уникальный идентификатор заказа, присвоенный сервером
    total: number; // итоговая сумма заказа, подтвержденная сервером
}

// Тип для ошибок валидации полей покупателя
export type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

