import { log, error } from './service/loggingService';
import { removeFromLocalStorage } from './service/storageService';
import { MessageActionsId, MessageResponse } from './types';

async function sendBackgroundMessage(
  message: MessageActionsId,
): Promise<MessageResponse> {
  try {
    log(`runtimeメッセージを送信します。 message:`, message);
    await chrome.runtime.sendMessage(message);
    return { success: true };
  } catch (errorMsg) {
    if (errorMsg instanceof Error) {
      error(`メッセージの送信に失敗しました : ${errorMsg.message}`);
      throw new Error(errorMsg.message);
    }
    return { success: false };
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const button = document.getElementById('item-info');
    if (!button) {
      throw new Error('ボタンがありませんでした');
    }

    button.addEventListener('click', async () => {
      log('ボタン押下時の処理を開始します');

      log('ローカルストレージの削除を開始します');
      await removeFromLocalStorage('itemList');
      log('ローカルストレージの削除を終了します');

      log('BackgroundへtodosItemsメッセージ送信を開始します');
      const response = await sendBackgroundMessage({
        action: 'todosItems',
      });
      log('BackgroundへtodosItemsメッセージ送信を終了します');
      log('ボタン押下時の処理を終了します。');
      if (!response.success) {
        alert('エラーが発生しました。');
        return;
      }
    });
  } catch (errorMsg) {
    error(`ボタン押下時のエラー: ${(errorMsg as Error).message}`);
    alert('エラーが発生しました。');
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const button = document.getElementById('relist-item');
    if (!button) {
      throw new Error('ボタンがありませんでした');
    }

    button.addEventListener('click', async () => {
      log('ボタン押下時の処理を開始します');

      log('BackgroundへgetListingItemsメッセージ送信を開始します');
      const response = await sendBackgroundMessage({
        action: 'getListingItems',
      });
      log('BackgroundへgetListingItemsメッセージ送信を終了します');
      log('ボタン押下時の処理を終了します。');
      if (!response.success) {
        alert('エラーが発生しました。');
        return;
      }
    });
  } catch (errorMsg) {
    error(`ボタン押下時のエラー: ${(errorMsg as Error).message}`);
    alert('エラーが発生しました。');
  }
});
