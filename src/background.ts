import { MessageActionsIdWithSelectors, MessageActionsIdWithSingleSelector } from './types';
let selectors: string[];
let currentSelectorIndex = 0;

chrome.runtime.onMessage.addListener(
  async (request: MessageActionsIdWithSelectors, sender, sendResponse) => {
    if (request.action === 'startListings') {
      console.log('再出品処理開始のメッセージを受信しました。');
      selectors = request.selectors;
      currentSelectorIndex = 0;
      if (selectors.length > 0) {
        console.log('商品の再出品を開始します。');
        sendMessageToContentScript(selectors[currentSelectorIndex]);
      }
      sendResponse();
      return true;
    }
  },
);

const sendMessageToContentScript = (selector: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id !== undefined) {
      chrome.tabs.sendMessage<MessageActionsIdWithSingleSelector>(tabs[0].id, {
        action: 'cloneAndDeleteItem',
        selector: selector,
      });
    }
  });
};

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (++currentSelectorIndex < selectors.length) {
    console.log(`${currentSelectorIndex}番目の商品を再出品します。`);
    sendMessageToContentScript(selectors[currentSelectorIndex]);
  } else {
    console.log('全ての商品を再出品しました。');
  }
});
