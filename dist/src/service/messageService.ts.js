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
import { injectable, inject } from "/vendor/.vite-deps-inversify.js__v--1a5dcd18.js";
import { TYPES } from "/src/container/inversify.types.ts.js";
export let MessageService = class {
  constructor(loggingService, selectorService, storageService) {
    this.loggingService = loggingService;
    this.selectorService = selectorService;
    this.storageService = storageService;
  }
  handleTodosItemMessage() {
    chrome.runtime.onMessage.addListener(
      async (request, _sender, sendResponse) => {
        if (request.action === "getTodosItems") {
          this.loggingService.log("商品の取得を開始します。");
          const itemList = this.selectorService.getAllItemsFromTodos();
          this.loggingService.log("商品リストをローカルストレージに保存します。");
          this.storageService.set("itemList", itemList);
          alert("商品情報の取得が完了しました。");
          sendResponse({ success: true });
        }
        return true;
      }
    );
  }
  handleGetListingItemsMessage() {
    chrome.runtime.onMessage.addListener(
      async (request, _sender, sendResponse) => {
        if (request.action === "getListingItems") {
          this.loggingService.log("再出品していない商品の特定を開始します。");
          this.loggingService.log(
            "再出品していない商品のリストをローカルストレージから削除します。"
          );
          await this.storageService.pop("notRelistItems");
          const items = await this.storageService.get("itemList");
          if (!items) {
            this.loggingService.error("商品リストが取得できませんでした。");
            sendResponse({ success: false });
            return;
          }
          const relistItems = this.selectorService.getAllItemsFromListings();
          const notRelistItems = items.itemList.filter(
            (item) => !relistItems.itemList.some((relistItem) => relistItem.name === item.name)
          );
          this.loggingService.log("再出品していない商品のリストをChrome Storageに保存します。");
          this.storageService.setToChromeStorage("notRelistItems", { itemList: notRelistItems });
          this.loggingService.log("再出品していない商品のリストをChrome Storageに保存しました。");
          alert("再出品していない商品を特定しました。\n拡張機能のオプションから確認してください。");
          this.loggingService.log("再出品していない商品の特定を終了します。");
          sendResponse({ success: true });
        }
        return true;
      }
    );
  }
  async sendContentScriptMessage(tabId, message) {
    return await this.tabsSendMessage(tabId, {
      action: message.action
    });
  }
  async sendBackgroundMessage(message) {
    return await this.runtimeSendMessage({
      action: message.action
    });
  }
  async tabsSendMessage(tabId, message) {
    try {
      this.loggingService.log(`tabにメッセージを送信します。 tabId: ${tabId}, message:`, message);
      await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      if (error instanceof Error) {
        this.loggingService.error(`メッセージの送信に失敗しました : ${error.message}`);
        throw new Error(error.message);
      }
    }
  }
  async runtimeSendMessage(message) {
    try {
      this.loggingService.log(`runtimeメッセージを送信します。 message:`, message);
      await chrome.runtime.sendMessage(message);
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        this.loggingService.error(`メッセージの送信に失敗しました : ${error.message}`);
        throw new Error(error.message);
      }
      return { success: false };
    }
  }
  async getActiveTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0 || tabs[0].id === void 0) {
          reject(new Error("No active tab found."));
        } else {
          this.loggingService.log(`Active tab found with ID: ${tabs[0].id}`);
          resolve(tabs[0].id);
        }
      });
    });
  }
};
MessageService = __decorateClass([
  injectable(),
  __decorateParam(0, inject(TYPES.LoggingService)),
  __decorateParam(1, inject(TYPES.SelectorService)),
  __decorateParam(2, inject(TYPES.StorageService))
], MessageService);
