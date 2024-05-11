import { MessageActionsId, MessageActionsIdWithSelectors, MessageData } from './types';

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0 || tabs[0].id === undefined) {
      console.error('No active tab found.');
      return;
    }
    chrome.tabs.sendMessage<MessageActionsId>(
      tabs[0].id,
      { action: 'fetchSelectors' },
      (response: MessageData | undefined) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError.message);
          return;
        }
        const container = document.querySelector('.listings-container');
        if (container && response && response.data) {
          let inputCount = 1;
          for (const product of response.data) {
            const listingItem = document.createElement('div');
            listingItem.classList.add('listing-item');
            listingItem.dataset.itemSelector = product.cloneAndDeleteItemSelector
              ? product.cloneAndDeleteItemSelector
              : '';

            // チェックボックスを作成
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `item-checkbox-${inputCount}`;
            checkbox.classList.add('item-checkbox');

            const productDetails = document.createElement('div');
            productDetails.classList.add('product-details');

            // 商品名
            const productName = document.createElement('label');
            productName.htmlFor = `item-checkbox-${inputCount}`;
            productName.textContent = `${product.name ?? ' '}`;

            // 商品画像
            const productImage = document.createElement('img');
            productImage.src = product.imageUrl ?? '';
            productImage.alt = product.name ?? 'No image';

            // 商品詳細をまとめる
            productDetails.appendChild(productName);
            productDetails.appendChild(productImage);

            // リストアイテムにチェックボックスと商品詳細を追加
            listingItem.appendChild(checkbox);
            listingItem.appendChild(productDetails);

            // コンテナにリストアイテムを追加
            container.appendChild(listingItem);
            inputCount++;
          }
        } else {
          console.error('No data received or container not found.');
        }
      },
    );
  });
});

// 拡張機能のPOPUPに表示されているhtmlのボタンをクリックしたときの処理
document.addEventListener('DOMContentLoaded', () => {
  const testButton = document.getElementById('start-button');
  if (!testButton) {
    throw new Error('start-button is null');
  }

  testButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== undefined) {
        // チェックされた商品のセレクター要素を取得する
        const checkedItems = Array.from(document.querySelectorAll<HTMLElement>('.listing-item'))
          .filter((item) => {
            const checkbox = item.querySelector<HTMLInputElement>('input[type="checkbox"]');
            return checkbox ? checkbox.checked : null;
          })
          .map((item) => item.dataset.itemSelector)
          .filter((item): item is string => item !== undefined);

        if (checkedItems.length === 0) {
          alert('再出品する商品を選択してください');
          return;
        }
        chrome.runtime.sendMessage<MessageActionsIdWithSelectors>({
          action: 'startListings',
          selectors: checkedItems,
        });
      } else {
        console.error('No active tab with a valid ID found.');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const backToTopButton = document.getElementById('back-to-top');
  if (!backToTopButton) {
    throw new Error('上に戻るボタンが見つかりませんでした');
  }

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
});
