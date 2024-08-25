import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../container/inversify.types';
import { Item } from '../types';
import { ISelectorService } from './selectorService';
import { Constants } from '../constants';

export interface IProductService {
  getTodosItem(element: Element): Item;
  getListingsItem(element: Element): Item;
}

@injectable()
export class ProductService implements IProductService {
  constructor(@inject(TYPES.SelectorService) private selectorService: ISelectorService) {}

  getTodosItem(element: Element): Item {
    return {
      id: this.selectorService.getId(
        this.selectorService.getHref(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.HREF),
      ),
      name: this.selectorService.getItemName(
        this.selectorService.getTextContent(
          element,
          Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME,
        ),
      ),
      thumbnail: this.selectorService.getThumbnail(
        element,
        Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.THUMBNAIL,
      ),
      url: this.selectorService.getHref(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.HREF),
    };
  }

  getListingsItem(element: Element): Item {
    return {
      id: this.selectorService.getId(
        this.selectorService.getHref(element, Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.HREF),
      ),
      name: this.selectorService.getRelistItemName(
        this.selectorService.getTextContent(
          element,
          Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.NAME,
        ),
      ),
      thumbnail: this.selectorService.getThumbnail(
        element,
        Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.THUMBNAIL,
      ),
      url: this.selectorService.getHref(
        element,
        Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.HREF,
      ),
    };
  }
}
