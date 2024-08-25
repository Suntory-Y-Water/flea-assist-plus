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
import "/vendor/.vite-deps-reflect-metadata.js__v--622bb7c6.js";
import { injectable, inject } from "/vendor/.vite-deps-inversify.js__v--622bb7c6.js";
import { TYPES } from "/src/container/inversify.types.ts.js";
export let PopupService = class {
  constructor(loggingService, messageService, storageService) {
    this.loggingService = loggingService;
    this.messageService = messageService;
    this.storageService = storageService;
  }
  getItemListButtonClick() {
    document.addEventListener("DOMContentLoaded", async () => {
      try {
        const button = document.getElementById("item-info");
        if (!button) {
          throw new Error("ボタンがありませんでした");
        }
        button.addEventListener("click", async () => {
          this.loggingService.log("ボタン押下時の処理を開始します");
          this.loggingService.log("ローカルストレージの削除を開始します");
          await this.storageService.pop("itemList");
          this.loggingService.log("ローカルストレージの削除を終了します");
          this.loggingService.log("BackgroundへtodosItemsメッセージ送信を開始します");
          const response = await this.messageService.sendBackgroundMessage({
            action: "todosItems"
          });
          this.loggingService.log("BackgroundへtodosItemsメッセージ送信を終了します");
          this.loggingService.log("ボタン押下時の処理を終了します。");
          if (!response.success) {
            alert("エラーが発生しました。");
            return;
          }
        });
      } catch (error) {
        this.loggingService.error(`ボタン押下時のエラー: ${error.message}`);
        alert("エラーが発生しました。");
      }
    });
  }
  getListingItemsButtonClick() {
    document.addEventListener("DOMContentLoaded", async () => {
      try {
        const button = document.getElementById("relist-item");
        if (!button) {
          throw new Error("ボタンがありませんでした");
        }
        button.addEventListener("click", async () => {
          this.loggingService.log("ボタン押下時の処理を開始します");
          this.loggingService.log("BackgroundへgetListingItemsメッセージ送信を開始します");
          const response = await this.messageService.sendBackgroundMessage({
            action: "getListingItems"
          });
          this.loggingService.log("BackgroundへgetListingItemsメッセージ送信を終了します");
          this.loggingService.log("ボタン押下時の処理を終了します。");
          if (!response.success) {
            alert("エラーが発生しました。");
            return;
          }
        });
      } catch (error) {
        this.loggingService.error(`ボタン押下時のエラー: ${error.message}`);
        alert("エラーが発生しました。");
      }
    });
  }
};
PopupService = __decorateClass([
  injectable(),
  __decorateParam(0, inject(TYPES.LoggingService)),
  __decorateParam(1, inject(TYPES.MessageService)),
  __decorateParam(2, inject(TYPES.StorageService))
], PopupService);
