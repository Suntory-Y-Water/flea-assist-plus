import { container } from './container/inversify.config';
import { TYPES } from './container/inversify.types';
import { ILoggingService } from './service/loggingService';
import { IMessageService } from './service/messageService';
import { MessageActionsId } from './types';

const messageService = container.get<IMessageService>(TYPES.MessageService);
const loggingService = container.get<ILoggingService>(TYPES.LoggingService);

chrome.runtime.onMessage.addListener(async (request: MessageActionsId, _sender, sendResponse) => {
  if (request.action === 'todosItems') {
    loggingService.log('BackgroundでtodosItemsメッセージを受信しました。');
    loggingService.log('content_scriptに商品取得メッセージを送信します。');
    const tabId = await messageService.getActiveTab();
    if (tabId === undefined) {
      throw new Error('タブIDが取得できませんでした');
    }
    messageService.sendContentScriptMessage(tabId, { action: 'getTodosItems' });
    loggingService.log('content_scriptに商品取得メッセージを送信終了');
    sendResponse();
  }

  if (request.action === 'getListingItems') {
    loggingService.log('BackgroundでgetListingItemsメッセージを受信しました。');
    loggingService.log('content_scriptに商品比較メッセージを送信します。');
    const tabId = await messageService.getActiveTab();
    if (tabId === undefined) {
      throw new Error('タブIDが取得できませんでした');
    }
    messageService.sendContentScriptMessage(tabId, { action: 'getListingItems' });
    loggingService.log('content_scriptに商品比較メッセージを送信終了');
    sendResponse();
  }
  return true;
});
