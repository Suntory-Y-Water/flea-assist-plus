import { log, error } from './service/loggingService';
import {
  getAllItemsFromTodos,
  getAllItemsFromListings,
} from './service/selectorService';
import {
  setToLocalStorage,
  getFromLocalStorage,
  setToChromeStorage,
} from './service/storageService';
import { MessageActionsId, MessageResponse, TodosItems } from './types';

function handleTodosItemMessage(): void {
  chrome.runtime.onMessage.addListener(
    async (
      request: MessageActionsId,
      _sender,
      sendResponse: (response?: MessageResponse) => void,
    ) => {
      if (request.action === 'getTodosItems') {
        log('商品の取得を開始します。');
        const itemList = getAllItemsFromTodos();

        if (itemList.itemList.length === 0) {
          alert('やることリストの商品が見つかりませんでした。');
          sendResponse({ success: false });
          return;
        }
        log('商品リストをローカルストレージに保存します。');
        await setToLocalStorage('itemList', itemList);
        alert('商品情報の取得が完了しました。');
        sendResponse({ success: true });
      }
      return true;
    },
  );
}

function handleGetListingItemsMessage(): void {
  chrome.runtime.onMessage.addListener(
    async (
      request: MessageActionsId,
      _sender,
      sendResponse: (response?: MessageResponse) => void,
    ) => {
      if (request.action === 'getListingItems') {
        log('再出品していない商品の特定を開始します。');
        log('再出品していない商品のリストをローカルストレージから削除します。');

        const items = await getFromLocalStorage<TodosItems>('itemList');
        if (!items) {
          error('商品リストが取得できませんでした。');
          sendResponse({ success: false });
          return;
        }
        const relistItems = getAllItemsFromListings();
        const notRelistItems = items.itemList.filter(
          (item) =>
            !relistItems.itemList.some(
              (relistItem) => relistItem.name === item.name,
            ),
        );
        const uniqueNotRelistItems = notRelistItems.filter(
          (item, index, self) =>
            self.findIndex((t) => t.name === item.name) === index,
        );

        log('再出品していない商品のリストをChrome Storageに保存します。');
        await setToChromeStorage('notRelistItems', {
          itemList: uniqueNotRelistItems,
        });
        log('再出品していない商品のリストをChrome Storageに保存しました。');

        alert(
          '再出品していない商品を特定しました。\n拡張機能のオプションから確認してください。',
        );
        log('再出品していない商品の特定を終了します。');

        sendResponse({ success: true });
      }
      return true;
    },
  );
}

handleTodosItemMessage();
handleGetListingItemsMessage();
