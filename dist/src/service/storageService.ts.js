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
import "/vendor/.vite-deps-reflect-metadata.js__v--1a5dcd18.js";
import { injectable } from "/vendor/.vite-deps-inversify.js__v--1a5dcd18.js";
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
  async setToChromeStorage(key, value) {
    try {
      const data = { [key]: value };
      await chrome.storage.local.set(data);
    } catch (error) {
      console.error("データの保存中にエラーが発生しました:", error);
    }
  }
  // chrome.storageからデータを取得するメソッド
  async getFromChromeStorage(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get([key], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[key] || null);
          }
        });
      } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
        reject(null);
      }
    });
  }
};
StorageService = __decorateClass([
  injectable()
], StorageService);
