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
import { Constants } from "/src/constants/index.ts.js";
export let MessageService = class {
  constructor(loggingService, productService, selectorService, storageService) {
    this.loggingService = loggingService;
    this.productService = productService;
    this.selectorService = selectorService;
    this.storageService = storageService;
  }
  handleTodosItemMessage() {
    chrome.runtime.onMessage.addListener(
      async (request, _sender, sendResponse) => {
        if (request.action === "getTodosItems") {
          let details = [];
          let count = 1;
          this.loggingService.log("商品の取得を開始します。");
          while (true) {
            const selector = `#main > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(${count}) > div.content__884ec505`;
            try {
              const element = document.querySelector(selector);
              if (element) {
                const isItem = this.selectorService.isRelistItem(
                  this.selectorService.getTextContent(
                    element,
                    Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME
                  )
                );
                if (!isItem) {
                  count++;
                  continue;
                }
                const productData = this.productService.getTodosItem(element);
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
          const itemList = {
            itemList: details
          };
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
          const relistItems = this.getAllItemsFromPage();
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
  getAllItemsFromPage() {
    this.loggingService.log("出品中の商品を全件取得します");
    let details = [];
    let count = 1;
    let element;
    while ((element = document.querySelector(
      `#currentListing > div > div:nth-child(${count}) > div.content__884ec505`
    )) !== null) {
      try {
        if (element) {
          const productData = this.productService.getListingsItem(element);
          details.push(productData);
          count++;
        } else {
          break;
        }
      } catch (error) {
        throw new Error(`商品の取得中にエラーが発生しました ${error}`);
      }
    }
    this.loggingService.log("商品の取得が完了しました。");
    const itemList = {
      itemList: details
    };
    return itemList;
  }
};
MessageService = __decorateClass([
  injectable(),
  __decorateParam(0, inject(TYPES.LoggingService)),
  __decorateParam(1, inject(TYPES.ProductService)),
  __decorateParam(2, inject(TYPES.SelectorService)),
  __decorateParam(3, inject(TYPES.StorageService))
], MessageService);
