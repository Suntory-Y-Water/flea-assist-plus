document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'fetchSelectors' }, function (response) {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError.message);
        return;
      }
      const container = document.querySelector('.listings-container');
      if (container && response && response.data) {
        for (const product of response.data) {
          console.log(`商品データ: ${product}`);
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
    });
  });
});

document.getElementById('test-button').addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'clickEditLink' });
  });
});
