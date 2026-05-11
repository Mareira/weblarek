import { Component } from '../base/Component';

export class Gallery extends Component<{ catalog: HTMLElement[] }> {
  protected _container: HTMLElement;

  constructor() {
    super(document.body);
    const galleryElement = document.querySelector('.gallery');
    if (!galleryElement) {
      throw new Error('Gallery container .gallery not found');
    }
    this._container = galleryElement as HTMLElement;
  }

  set catalog(items: HTMLElement[]) {
    this._container.innerHTML = '';
    items.forEach(item => this._container.appendChild(item));
  }
}