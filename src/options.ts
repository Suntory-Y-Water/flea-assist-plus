import { log } from './service/loggingService';
import { getFromChromeStorage } from './service/storageService';
import { TodosItems } from './types';

document.addEventListener('DOMContentLoaded', async () => {
  const data = await getFromChromeStorage<TodosItems>('notRelistItems');
  log('データを取得しました。');

  if (data && data.itemList.length > 0) {
    renderItems(data);
    data.itemList.map((item) =>
      console.log(`https://jp.mercari.com/item/${item.id}`),
    );
  } else {
    log('データが存在しません。');
  }
});

function renderItems(data: TodosItems) {
  const container = document.getElementById('item-list');
  if (!container) {
    return;
  }

  data.itemList.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');

    const thumbnailElement = document.createElement('img');
    thumbnailElement.src = item.thumbnail;
    itemElement.appendChild(thumbnailElement);

    const detailsElement = document.createElement('div');
    detailsElement.classList.add('item-details');

    const linkElement = document.createElement('a');
    linkElement.href = `https://jp.mercari.com/item/${item.id}`;
    linkElement.target = '_blank';
    linkElement.textContent = item.name;

    detailsElement.appendChild(linkElement);
    itemElement.appendChild(detailsElement);

    container.appendChild(itemElement);
  });
}
