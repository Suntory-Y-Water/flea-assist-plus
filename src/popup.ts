import { ProductData } from './types';

interface FetchSelectorsMessage {
  data: ProductData[];
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0 || tabs[0].id === undefined) {
      console.error('No active tab found.');
      return;
    }
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'fetchSelectors' },
      function (response: FetchSelectorsMessage | undefined) {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError.message);
          return;
        }
        const container = document.querySelector('.listings-container');
        if (container && response && response.data) {
          for (const product of response.data) {
            const listingItem = document.createElement('div');
            listingItem.classList.add('listing-item');

            const productName = document.createElement('h3');
            productName.textContent = `Product Name: ${product.name ?? 'Not available'}`;

            const productImage = document.createElement('img');
            productImage.src = product.imageUrl ?? '';
            productImage.alt = product.name ?? 'No image';

            const editLinkStatus = document.createElement('p');
            editLinkStatus.textContent = `Edit Link: ${
              product.hasEditLink ? 'Available' : 'Not available'
            }`;

            listingItem.appendChild(productName);
            listingItem.appendChild(productImage);
            listingItem.appendChild(editLinkStatus);

            container.appendChild(listingItem);
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
  const testButton = document.getElementById('test-button');
  if (!testButton) {
    throw new Error('testButton is null');
  }

  testButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== undefined) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'clickEditLink' });
        console.log('編集ボタンをクリックしました。');
      } else {
        console.error('No active tab with a valid ID found.');
      }
    });
  });
});
