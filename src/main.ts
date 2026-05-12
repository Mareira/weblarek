import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { LarekApi } from "./components/LarekApi";
import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { Modal } from "./components/common/Modal";
import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CardBasket } from "./components/view/CardBasket";
import { Cart } from "./components/view/Cart";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";
import { API_URL, CDN_URL } from "./utils/constants";

document.addEventListener("DOMContentLoaded", () => {
  const events = new EventEmitter();
  const api = new Api(API_URL);
  const larekApi = new LarekApi(api);
  const productsModel = new ProductsModel(events);
  const cartModel = new CartModel(events);
  const buyerModel = new BuyerModel(events);

  // Компоненты (создаются один раз)
  const header = new Header(document.querySelector(".header")!, () =>
    events.emit("page:cartOpen"),
  );
  const gallery = new Gallery();
  const modal = new Modal(document.querySelector("#modal-container")!);

  const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
  const basket = new Cart(
    basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement,
    () => events.emit("cart:checkout"),
  );

  const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
  const orderForm = new OrderForm(
    orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement,
    (data) => events.emit("order:formChange", data),
    () => events.emit("order:submit"),
  );

  const contactsTemplate = document.querySelector("#contacts") as HTMLTemplateElement;
  const contactsForm = new ContactsForm(
    contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement,
    (data) => events.emit("contacts:formChange", data),
    () => events.emit("contacts:submit"),
  );

  const successTemplate = document.querySelector("#success") as HTMLTemplateElement;
  const success = new Success(
    successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement,
    () => modal.close(),
  );

  // Представление для превью (создаётся один раз)
  const previewTemplate = document.querySelector("#card-preview") as HTMLTemplateElement;
  const previewCard = new CardPreview(
    previewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement,
    {
      onButtonClick: () => events.emit("card:buttonClick"),
    }
  );

  // События от форм
  events.on("order:formChange", (data) => buyerModel.setData(data));
  events.on("contacts:formChange", (data) => buyerModel.setData(data));

  // Загрузка товаров
  larekApi
    .getProducts()
    .then((data) => productsModel.setItems(data.items))
    .catch(() => {});

  // Каталог
  events.on("products:changed", () => {
    const cards = productsModel.getItems().map((product) => {
      const template = document.querySelector("#card-catalog") as HTMLTemplateElement;
      const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const card = new CardCatalog(cardElement, {
        onClick: () => events.emit("product:select", { id: product.id }),
      });
      card.title = product.title;
      card.price = product.price === null ? "Бесценно" : `${product.price} синапсов`;
      card.image = CDN_URL + product.image;
      card.category = product.category;
      return cardElement;
    });
    gallery.catalog = cards;
  });

  // Выбор товара для просмотра
  events.on("product:select", (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
      productsModel.setSelectedProduct(product);
    }
  });

  // Отображение карточки товара (один раз с обновлением через render)
  events.on("product:selected", () => {
    const product = productsModel.getSelectedProduct();
    if (!product) return;

    previewCard.title = product.title;
    previewCard.price = product.price === null ? "Бесценно" : `${product.price} синапсов`;
    previewCard.image = CDN_URL + product.image;
    previewCard.category = product.category;
    previewCard.description = product.description;
    previewCard.buttonText = product.price === null
      ? "Недоступно"
      : cartModel.hasItem(product.id)
        ? "Удалить из корзины"
        : "Купить";
    previewCard.buttonDisabled = product.price === null;

    modal.render({ title: product.title, content: previewCard.render() });
  });

  // Обработчик кнопки в превью
  events.on("card:buttonClick", () => {
    const product = productsModel.getSelectedProduct();
    if (product) {
      if (cartModel.hasItem(product.id)) {
        cartModel.removeItem(product.id);
      } else {
        cartModel.addItem(product);
      }
      modal.close();
    }
  });

  // Корзина
  events.on("page:cartOpen", () =>
    modal.render({ title: "Корзина", content: basket.render() }),
  );

  events.on("cart:changed", () => {
    const cards = cartModel.getItems().map((item, index) => {
      const template = document.querySelector("#card-basket") as HTMLTemplateElement;
      const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const card = new CardBasket(cardElement, () =>
        cartModel.removeItem(item.id),
      );
      card.title = item.title;
      card.price = item.price === null ? "Бесценно" : `${item.price} синапсов`;
      card.index = index + 1;
      return cardElement;
    });
    basket.items = cards;
    basket.total = cartModel.getTotalPrice();
  });

  events.on("cart:countChanged", () => (header.counter = cartModel.getCount()));

  // Оформление заказа
  events.on("cart:checkout", () => {
    buyerModel.clear();
    orderForm.address = "";
    orderForm.payment = null;
    contactsForm.email = "";
    contactsForm.phone = "";
    modal.render({ title: "Оформление заказа", content: orderForm.render() });
  });

  // Валидация и обновление форм
  events.on("buyer:changed", () => {
    const buyer = buyerModel.getData();
    const errors = buyerModel.validate();

    orderForm.payment = buyer.payment;
    orderForm.address = buyer.address;
    contactsForm.email = buyer.email;
    contactsForm.phone = buyer.phone;

    const orderErrors = [errors.address, errors.payment].filter(Boolean).join("; ");
    orderForm.errors = orderErrors;
    orderForm.valid = orderErrors.length === 0;

    const contactsErrors = [errors.email, errors.phone].filter(Boolean).join("; ");
    contactsForm.errors = contactsErrors;
    contactsForm.valid = contactsErrors.length === 0;
  });

  events.on("order:submit", () => {
    modal.render({ title: "Контакты", content: contactsForm.render() });
  });

  events.on("contacts:submit", () => {
    const buyer = buyerModel.getData();
    larekApi
      .sendOrder({
        payment: buyer.payment,
        address: buyer.address,
        email: buyer.email,
        phone: buyer.phone,
        items: cartModel.getItems().map((item) => item.id),
        total: cartModel.getTotalPrice(),
      })
      .then((result) => {
        success.total = result.total;
        cartModel.clear();
        buyerModel.clear();
        modal.render({ title: "Успешно", content: success.render() });
      })
      .catch(() => (orderForm.errors = "Ошибка при отправке заказа"));
  });
});