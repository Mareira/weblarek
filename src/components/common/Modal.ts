import { Component } from '../base/Component';

export class Modal extends Component<{ title: string; content: HTMLElement }> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _container: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._container = container.querySelector('.modal__container') as HTMLElement;
    this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this._content = container.querySelector('.modal__content') as HTMLElement;

    this._closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this._content.innerHTML = '';
  }

  set title(value: string) {
    // В твоей вёрстке заголовок может быть внутри модалки
    const titleElement = this._container?.querySelector('.modal__title');
    if (titleElement) titleElement.textContent = value;
  }

  set content(value: HTMLElement) {
    this._content.innerHTML = '';
    this._content.appendChild(value);
  }

  render(data: { title: string; content: HTMLElement }): HTMLElement {
    if (data.title) this.title = data.title;
    if (data.content) this.content = data.content;
    this.open();
    return this.container;
  }
}