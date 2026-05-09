import './scss/styles.scss';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { ProductsModel } from './components/Models/ProductsModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';


// ========== 1. СОЗДАНИЕ ЭКЗЕМПЛЯРОВ ВСЕХ КЛАССОВ ==========
const productsModel = new ProductsModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// ========== 2. ТЕСТИРОВАНИЕ МЕТОДОВ МОДЕЛЕЙ ДАННЫХ ==========
console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===');

// Каталог товаров
productsModel.setItems(apiProducts.items);
console.log('Каталог товаров (getItems):', productsModel.getItems());
console.log('Товар по id "854cef69-976d-4c2a-a18c-2aa45046c390" (getProductById):', productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));
productsModel.setSelectedProduct(apiProducts.items[0]);
console.log('Выбранный товар (getSelectedProduct):', productsModel.getSelectedProduct());

// Корзина
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('Корзина (getItems):', cartModel.getItems());
console.log('Общая сумма (getTotalPrice):', cartModel.getTotalPrice());
console.log('Количество товаров (getCount):', cartModel.getCount());
console.log('Есть товар id "854cef69-976d-4c2a-a18c-2aa45046c390"? (hasItem):', cartModel.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
cartModel.removeItem('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('После удаления (removeItem):', cartModel.getItems());
cartModel.clear();
console.log('После очистки (clear):', cartModel.getItems());

// Покупатель
buyerModel.setData({ email: 'test@test.ru', phone: '+79991234567', address: 'ул. Тестовая' });
console.log('Данные покупателя (getData):', buyerModel.getData());
console.log('Валидация без payment (validate):', buyerModel.validate());
buyerModel.setData({ payment: 'card' });
console.log('Валидация с payment (validate):', buyerModel.validate());
buyerModel.clear();
console.log('После очистки (clear):', buyerModel.getData());

// ========== 3. ЗАПРОС К СЕРВЕРУ ==========
console.log('\n=== ЗАПРОС К СЕРВЕРУ ===');

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi.getProducts()
  .then((data: any) => {
    console.log('Получено с сервера:', data);
    productsModel.setItems(data.items);
    console.log('Сохранено в модели каталога:', productsModel.getItems());
  })
  .catch((err: any) => {
    console.error('Ошибка:', err);
  });