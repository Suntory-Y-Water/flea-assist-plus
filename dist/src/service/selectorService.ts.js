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
      return "./mercari.png";
    }
    const thumbnail = targetElement.querySelector("img")?.getAttribute("src");
    return thumbnail ? thumbnail : "./mercari.png";
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
  isRelistItem(name) {
    const falsePatterns = [
      /取引メッセージがあります。返信をお願いします/,
      /受取りました。.*取引完了してください/
    ];
    for (const pattern of falsePatterns) {
      if (pattern.test(name)) {
        return false;
      }
    }
    return true;
  }
};
SelectorService = __decorateClass([
  injectable(),
  __decorateParam(0, inject(TYPES.LoggingService))
], SelectorService);
