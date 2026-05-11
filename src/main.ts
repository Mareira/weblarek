import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Modal } from './components/common/Modal';
import { Page } from './components/view/Page';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Cart } from './components/view/Cart';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { API_URL, CDN_URL } from './utils/constants';

// ========== 1. СОЗДАНИЕ ЭКЗЕМПЛЯРОВ ==========
const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// ========== 2. ПОИСК DOM-ЭЛЕМЕНТОВ ==========
const pageContainer = document.querySelector('.page') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;

const page = new Page(pageContainer, () => {
  events.emit('page:cartOpen');
});
const modal = new Modal(modalContainer);

// Создаём корзину
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketContainer = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const basket = new Cart(basketContainer, () => {
  events.emit('cart:checkout');
});

// Создаём формы
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderContainer = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(orderContainer, (data) => {
  buyerModel.setData({ payment: data.payment, address: data.address });
});

const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsContainer = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const contactsForm = new ContactsForm(contactsContainer, (data) => {
  buyerModel.setData({ email: data.email, phone: data.phone });
});

// ========== 3. ЗАГРУЗКА ТОВАРОВ ==========
larekApi.getProducts()
  .then(data => {
    productsModel.setItems(data.items);
  })
  .catch(err => console.error('Ошибка:', err));

// ========== 4. ОБРАБОТЧИК: обновление каталога ==========
events.on('products:changed', () => {
  const products = productsModel.getItems();
  const cards: HTMLElement[] = [];

  products.forEach(product => {
    const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
    const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    
    const card = new CardCatalog(cardElement, {
      onClick: () => {
        productsModel.setSelectedProduct(product);
      }
    });
    
    card.title = product.title;
    card.price = product.price;
    card.image = CDN_URL + product.image;
    card.category = product.category;
    
    cards.push(cardElement);
  });
  
  page.catalog = cards;
});

// ========== 5. ОБРАБОТЧИК: открытие карточки товара ==========
events.on('product:selected', () => {
  const product = productsModel.getSelectedProduct();
  if (!product) return;
  
  const template = document.querySelector('#card-preview') as HTMLTemplateElement;
  const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  
  const preview = new CardPreview(cardElement, {
    onButtonClick: () => {
      if (cartModel.hasItem(product.id)) {
        cartModel.removeItem(product.id);
      } else {
        cartModel.addItem(product);
      }
      modal.close();
    }
  });
  
  preview.title = product.title;
  preview.price = product.price;
  preview.image = CDN_URL + product.image;
  preview.category = product.category;
  preview.description = product.description;
  
  if (cartModel.hasItem(product.id)) {
    preview.buttonText = 'Удалить из корзины';
  } else {
    preview.buttonText = product.price === null ? 'Недоступно' : 'Купить';
  }
  
  modal.render({
    title: product.title,
    content: cardElement
  });
});

// ========== 6. ОБРАБОТЧИКИ КОРЗИНЫ ==========
events.on('page:cartOpen', () => {
  events.emit('cart:changed');
  modal.render({
    title: 'Корзина',
    content: basketContainer
  });
});

events.on('cart:changed', () => {
  const items = cartModel.getItems();
  const cards: HTMLElement[] = [];
  
  items.forEach((item, index) => {
    const template = document.querySelector('#card-basket') as HTMLTemplateElement;
    const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    
    const card = new CardBasket(cardElement, {
      onButtonClick: () => {
        cartModel.removeItem(item.id);
      }
    });
    
    card.title = item.title;
    card.price = item.price;
    card.index = index + 1;
    
    cards.push(cardElement);
  });
  
  basket.items = cards;
  basket.total = cartModel.getTotalPrice();
});

events.on('cart:countChanged', () => {
  page.cartCounter = cartModel.getCount();
});

// ========== 7. ОБРАБОТЧИКИ ФОРМ ЗАКАЗА ==========
events.on('cart:checkout', () => {
  // Очищаем данные перед новым заказом
  buyerModel.clear();
  // Сбрасываем поля форм
  orderForm.address = '';
  orderForm.payment = null;
  contactsForm.email = '';
  contactsForm.phone = '';
  // Сбрасываем активные классы кнопок оплаты
  const paymentBtns = orderContainer.querySelectorAll('.button_alt');
  paymentBtns.forEach(btn => btn.classList.remove('button_alt-active'));
  
  modal.render({
    title: 'Оформление заказа',
    content: orderContainer
  });
});

// Валидация и активация кнопок
events.on('buyer:changed', () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  
  // Первый шаг
  const isOrderValid = !!(buyer.address && buyer.payment);
  orderForm.valid = isOrderValid;
  orderForm.errors = errors.address || errors.payment || '';
  
  // Второй шаг
  const isContactsValid = !!(buyer.email && buyer.phone);
  contactsForm.valid = isContactsValid;
  contactsForm.errors = errors.email || errors.phone || '';
});

// Переход ко второму шагу (обработчик кнопки "Далее")
const nextButton = orderContainer.querySelector('.order__button') as HTMLButtonElement;
if (nextButton) {
  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    const buyer = buyerModel.getData();
    if (buyer.address && buyer.payment) {
      modal.render({
        title: 'Контакты',
        content: contactsContainer
      });
    }
  });
}

// Отправка заказа (обработчик кнопки "Оплатить")
const payButton = contactsContainer.querySelector('.button') as HTMLButtonElement;
if (payButton) {
  payButton.addEventListener('click', (e) => {
    e.preventDefault();
    const buyer = buyerModel.getData();
    if (buyer.email && buyer.phone) {
      const orderData = {
        payment: buyer.payment,
        address: buyer.address,
        email: buyer.email,
        phone: buyer.phone,
        items: cartModel.getItems().map(item => item.id),
        total: cartModel.getTotalPrice()
      };
      
      larekApi.sendOrder(orderData)
        .then(result => {
          const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
          const successContainer = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
          const success = new Success(successContainer, () => {
            modal.close();
          });
          success.total = result.total;
          
          cartModel.clear();
          buyerModel.clear();
          
          modal.render({
            title: 'Успешно',
            content: successContainer
          });
        })
        .catch(err => {
          console.error('Ошибка:', err);
          orderForm.errors = 'Ошибка при отправке заказа';
        });
    }
  });
}
