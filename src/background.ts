import { log, error } from './service/loggingService';
import { MessageActionsId } from './types';

async function getActiveTab(): Promise<number | undefined> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0 || tabs[0].id === undefined) {
        reject(new Error('No active tab found.'));
      } else {
        log(`Active tab found with ID: ${tabs[0].id}`);
        resolve(tabs[0].id);
      }
    });
  });
}

async function sendContentScriptMessage(
  tabId: number,
  message: MessageActionsId,
): Promise<void> {
  try {
    log(`tabにメッセージを送信します。 tabId: ${tabId}, message:`, message);
    await chrome.tabs.sendMessage(tabId, message);
  } catch (errorMsg) {
    if (errorMsg instanceof Error) {
      error(`メッセージの送信に失敗しました : ${errorMsg.message}`);
      throw new Error(errorMsg.message);
    }
  }
}

chrome.runtime.onMessage.addListener(
  async (request: MessageActionsId, _sender, sendResponse) => {
    if (request.action === 'todosItems') {
      log('BackgroundでtodosItemsメッセージを受信しました。');
      log('content_scriptに商品取得メッセージを送信します。');
      const tabId = await getActiveTab();
      if (tabId === undefined) {
        throw new Error('タブIDが取得できませんでした');
      }
      await sendContentScriptMessage(tabId, { action: 'getTodosItems' });
      log('content_scriptに商品取得メッセージを送信終了');
      sendResponse();
    }

    if (request.action === 'getListingItems') {
      log('BackgroundでgetListingItemsメッセージを受信しました。');
      log('content_scriptに商品比較メッセージを送信します。');
      const tabId = await getActiveTab();
      if (tabId === undefined) {
        throw new Error('タブIDが取得できませんでした');
      }
      await sendContentScriptMessage(tabId, { action: 'getListingItems' });
      log('content_scriptに商品比較メッセージを送信終了');
      sendResponse();
    }
    return true;
  },
);
