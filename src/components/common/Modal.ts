import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<{ title: string; content: HTMLElement }> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _container: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._container = ensureElement('.modal__container', container);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement('.modal__content', container);

    this._closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.body.classList.add('modal-open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    document.body.classList.remove('modal-open');
    this._content.innerHTML = '';
  }

  set title(value: string) {
    const titleElement = this._container.querySelector('.modal__title');
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