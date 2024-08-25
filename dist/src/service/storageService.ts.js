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
import "/vendor/.vite-deps-reflect-metadata.js__v--622bb7c6.js";
import { injectable } from "/vendor/.vite-deps-inversify.js__v--622bb7c6.js";
export let StorageService = class {
  async get(key) {
    try {
      const result = localStorage.getItem(key);
      if (result === null) {
        return null;
      }
      return JSON.parse(result);
    } catch (error) {
      return null;
    }
  }
  async set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
    }
  }
  async pop(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }
};
StorageService = __decorateClass([
  injectable()
], StorageService);
