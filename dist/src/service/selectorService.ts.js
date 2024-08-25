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
export let SelectorService = class {
  constructor(loggingService) {
    this.loggingService = loggingService;
  }
  getTextContent(element, selector) {
    const targetElement = element.querySelector(selector);
    if (!targetElement) {
      return "";
    }
    return targetElement.textContent || "";
  }
  getThumbnail(element, selector) {
    const targetElement = element.querySelector(selector);
    if (!targetElement) {
      return "./box.png";
    }
    const thumbnail = targetElement.querySelector("img")?.getAttribute("src");
    return thumbnail ? thumbnail : "./box.png";
  }
  getHref(element, selector) {
    const targetElement = element.querySelector(selector);
    if (!targetElement) {
      return "";
    }
    return targetElement.getAttribute("href") || "";
  }
  getId(href) {
    return href.split("/").pop() || "";
  }
  getItemName(name) {
    const regex = /「([^」]+)」/;
    const match = name.match(regex);
    if (match) {
      return match[1].trim().replace(/\s+/g, "");
    }
    throw new Error("商品名が取得できませんでした");
  }
  getRelistItemName(name) {
    return name.trim().replace(/\s+/g, "");
  }
  isRelistItem(message) {
    const falsePatterns = [
      /取引メッセージがあります。返信をお願いします/,
      /受取りました。.*取引完了してください/,
      /まとめ商品/
    ];
    for (const pattern of falsePatterns) {
      if (pattern.test(message)) {
        return false;
      }
    }
    return true;
  }
  getTodosItem(element) {
    return {
      id: this.getId(this.getHref(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.HREF)),
      name: this.getItemName(
        this.getTextContent(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME)
      ),
      thumbnail: this.getThumbnail(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.THUMBNAIL),
      url: this.getHref(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.HREF)
    };
  }
  getListingsItem(element) {
    return {
      id: this.getId(this.getHref(element, Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.HREF)),
      name: this.getRelistItemName(
        this.getTextContent(element, Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.NAME)
      ),
      thumbnail: this.getThumbnail(
        element,
        Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.THUMBNAIL
      ),
      url: this.getHref(element, Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.HREF)
    };
  }
  collectItemsFromPage(baseSelector, itemSelector, getItemData, validateItem) {
    this.loggingService.log("商品の取得を開始します。");
    let details = [];
    let count = 1;
    let element;
    while ((element = document.querySelector(
      `${baseSelector} > div:nth-child(${count}) > ${itemSelector}`
    )) !== null) {
      try {
        if (element) {
          if (validateItem && !validateItem(element)) {
            count++;
            continue;
          }
          const productData = getItemData(element);
          details.push(productData);
          count++;
        } else {
          break;
        }
      } catch (error) {
        this.loggingService.error("商品の取得中にエラーが発生しました");
        this.loggingService.error(`エラー内容 : ${error.message}`);
        break;
      }
    }
    this.loggingService.log("商品の取得が完了しました。");
    return { itemList: details };
  }
  getAllItemsFromListings() {
    return this.collectItemsFromPage(
      "#currentListing > div",
      "div.content__884ec505",
      (element) => this.getListingsItem(element),
      void 0
    );
  }
  getAllItemsFromTodos() {
    return this.collectItemsFromPage(
      "#main > div.merList.border__17a1e07b.separator__17a1e07b",
      "div.content__884ec505",
      (element) => this.getTodosItem(element),
      (element) => {
        const name = this.getTextContent(
          element,
          Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME
        );
        return this.isRelistItem(name);
      }
    );
  }
};
SelectorService = __decorateClass([
  injectable(),
  __decorateParam(0, inject(TYPES.LoggingService))
], SelectorService);
