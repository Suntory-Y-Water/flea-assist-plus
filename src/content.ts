import { MessageActionsId, MessageActionsIdWithSingleSelector, ProductData } from './types';

const waitForElementToAppear = async (
  selector: string,
  interval: number = 1000,
  timeout: number = 5000,
): Promise<Element | null> => {
  const startTime = Date.now();

  while (Date.now() - startTime <= timeout) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  console.log(`Element not found: ${selector}`);
  return null;
};

const getProductData = (element: Element, count: number): ProductData => {
  const nameElement = element.querySelector('.content__97a42da1 > span');
  const imageElement = element.querySelector(
    '.merItemThumbnail.medium__a6f874a2.thumbnail__97a42da1 > figure > div.imageContainer__f8ddf3a2 > picture > img',
  );
  const cloneAndDeleteItemElement = element.querySelector('#clone-and-delete-item');

  return {
    name: nameElement ? nameElement.textContent : null,
    imageUrl: imageElement ? imageElement.getAttribute('src') : null,
    cloneAndDeleteItemSelector: cloneAndDeleteItemElement
      ? `#currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(${count}) > div.content__884ec505 > a > div > div > #clone-and-delete-item`
      : null,
  };
};

chrome.runtime.onMessage.addListener(async (request: MessageActionsId, sender, sendResponse) => {
  if (request.action == 'fetchSelectors') {
    let details = [];
    for (let count = 1; count <= 50; count++) {
      const selector = `#currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(${count}) > div.content__884ec505 > a > div > div`;
      try {
        const element = await waitForElementToAppear(selector, 1000, 5000);
        if (element) {
          const productData = getProductData(element, count);
          details.push(productData);
        } else {
          console.log(`Product ${count} not found.`);
        }
      } catch (error) {
        console.log(`Error finding product ${count}:`, error);
      }
    }

    console.log('全ての商品を取得しました。');
    sendResponse({ data: details });
  }
  return true;
});

// 受信したメッセージのセレクター要素をクリックする。
chrome.runtime.onMessage.addListener(
  (request: MessageActionsIdWithSingleSelector, sender, sendResponse) => {
    if (request.action !== 'cloneAndDeleteItem') {
      console.error(`メッセージID : ${request.action}`);
      throw new Error('異なるメッセージを受信しました。');
    }

    const itemSelector = document.querySelector<HTMLElement>(request.selector);
    if (!itemSelector) {
      throw new Error('要素が見つかりませんでした。');
    }
    itemSelector.click();
    sendResponse();
  },
);
