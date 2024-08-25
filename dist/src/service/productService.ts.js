var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
import "/vendor/.vite-deps-reflect-metadata.js__v--1a5dcd18.js";
import { injectable, inject } from "/vendor/.vite-deps-inversify.js__v--1a5dcd18.js";
import { TYPES } from "/src/container/inversify.types.ts.js";
import { Constants } from "/src/constants/index.ts.js";
export let ProductService = class {
  constructor(selectorService) {
    this.selectorService = selectorService;
  }
  getTodosItem(element) {
    return {
      id: this.selectorService.getId(
        this.selectorService.getHref(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.HREF)
      ),
      name: this.selectorService.getItemName(
        this.selectorService.getTextContent(
          element,
          Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME
        )
      ),
      thumbnail: this.selectorService.getThumbnail(
        element,
        Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.THUMBNAIL
      ),
      url: this.selectorService.getHref(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.HREF)
    };
  }
  getListingsItem(element) {
    return {
      id: this.selectorService.getId(
        this.selectorService.getHref(element, Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.HREF)
      ),
      name: this.selectorService.getRelistItemName(
        this.selectorService.getTextContent(
          element,
          Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.NAME
        )
      ),
      thumbnail: this.selectorService.getThumbnail(
        element,
        Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.THUMBNAIL
      ),
      url: this.selectorService.getHref(
        element,
        Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.HREF
      )
    };
  }
};
ProductService = __decorateClass([
  injectable(),
  __decorateParam(0, inject(TYPES.SelectorService))
], ProductService);
