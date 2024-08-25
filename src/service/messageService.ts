import { MessageActionsId, MessageResponse, TodosItems } from '../types';
import { injectable, inject } from 'inversify';
import { TYPES } from '../container/inversify.types';
import { ILoggingService } from './loggingService';
import { IProductService } from './productService';
import { ISelectorService } from './selectorService';
import { Constants } from '../constants';
import { IStorageService } from './storageService';

export interface IMessageService {
  handleTodosItemMessage(): void;
  handleGetListingItemsMessage(): void;
  /**
   * @description 拡張機能のPOPUPを開いたとき、content_scriptに任意のポップアップメッセージを送信する
   * @param {number} tabId 送信先のタブID、タブをユニークに指定するために設定する
   * @param {MessageActionsId} messageId 送信するメッセージのID
   */
  sendContentScriptMessage(tabId: number, message: MessageActionsId): Promise<void>;

  sendBackgroundMessage(message: MessageActionsId): Promise<MessageResponse>;

  getActiveTab(): Promise<number | undefined>;
}

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.LoggingService) private loggingService: ILoggingService,
    @inject(TYPES.ProductService) private productService: IProductService,
    @inject(TYPES.SelectorService) private selectorService: ISelectorService,
    @inject(TYPES.StorageService) private storageService: IStorageService,
  ) {}

  handleTodosItemMessage(): void {
    chrome.runtime.onMessage.addListener(
      async (
        request: MessageActionsId,
        _sender,
        sendResponse: (response?: MessageResponse) => void,
      ) => {
        if (request.action === 'getTodosItems') {
          let details = [];
          let count = 1;

          this.loggingService.log('商品の取得を開始します。');
          // 商品の要素が見つかるまでループを回す
          while (true) {
            const selector = `#main > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(${count}) > div.content__884ec505`;
            try {
              const element = document.querySelector(selector);
              if (element) {
                const isItem = this.selectorService.isRelistItem(
                  this.selectorService.getTextContent(
                    element,
                    Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME,
                  ),
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
              this.loggingService.error('商品の取得中にエラーが発生しました');
              this.loggingService.error(`エラー内容 : ${(error as Error).message}`);
              break;
            }
          }
          this.loggingService.log('商品の取得が完了しました。');
          const itemList: TodosItems = {
            itemList: details,
          };

          this.loggingService.log('商品リストをローカルストレージに保存します。');
          this.storageService.set('itemList', itemList);
          alert('商品情報の取得が完了しました。');
          sendResponse({ success: true });
        }
        return true;
      },
    );
  }

  handleGetListingItemsMessage(): void {
    chrome.runtime.onMessage.addListener(
      async (
        request: MessageActionsId,
        _sender,
        sendResponse: (response?: MessageResponse) => void,
      ) => {
        if (request.action === 'getListingItems') {
          this.loggingService.log('再出品していない商品の特定を開始します。');
          this.loggingService.log(
            '再出品していない商品のリストをローカルストレージから削除します。',
          );
          await this.storageService.pop('notRelistItems');
          const items = await this.storageService.get<TodosItems>('itemList');
          if (!items) {
            this.loggingService.error('商品リストが取得できませんでした。');
            sendResponse({ success: false });
            return;
          }

          const relistItems = this.getAllItemsFromPage();
          // itemsのnameから、relistItemsのnameに一致しないものを抽出
          const notRelistItems = items.itemList.filter(
            (item) => !relistItems.itemList.some((relistItem) => relistItem.name === item.name),
          );

          this.loggingService.log('再出品していない商品のリストをChrome Storageに保存します。');
          this.storageService.setToChromeStorage('notRelistItems', { itemList: notRelistItems });
          this.loggingService.log('再出品していない商品のリストをChrome Storageに保存しました。');

          alert('再出品していない商品を特定しました。\n拡張機能のオプションから確認してください。');
          this.loggingService.log('再出品していない商品の特定を終了します。');

          sendResponse({ success: true });
        }
        return true;
      },
    );
  }

  async sendContentScriptMessage(tabId: number, message: MessageActionsId): Promise<void> {
    return await this.tabsSendMessage(tabId, {
      action: message.action,
    });
  }

  async sendBackgroundMessage(message: MessageActionsId): Promise<MessageResponse> {
    return await this.runtimeSendMessage({
      action: message.action,
    });
  }

  private async tabsSendMessage(tabId: number, message: MessageActionsId) {
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

  private async runtimeSendMessage(message: MessageActionsId): Promise<MessageResponse> {
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

  async getActiveTab(): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0 || tabs[0].id === undefined) {
          reject(new Error('No active tab found.'));
        } else {
          this.loggingService.log(`Active tab found with ID: ${tabs[0].id}`);
          resolve(tabs[0].id);
        }
      });
    });
  }
  private getAllItemsFromPage(): TodosItems {
    this.loggingService.log('出品中の商品を全件取得します');
    let details = [];
    let count = 1;
    let element: Element | null;
    while (
      (element = document.querySelector(
        `#currentListing > div > div:nth-child(${count}) > div.content__884ec505`,
      )) !== null
    ) {
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
    this.loggingService.log('商品の取得が完了しました。');
    const itemList: TodosItems = {
      itemList: details,
    };
    return itemList;
  }
}
