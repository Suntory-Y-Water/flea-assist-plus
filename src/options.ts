import { ILoggingService } from './service/loggingService';
import { IStorageService } from './service/storageService';
import { container } from './container/inversify.config';
import { TYPES } from './container/inversify.types';
import { TodosItems } from './types';

const storageService = container.get<IStorageService>(TYPES.StorageService);
const loggingService = container.get<ILoggingService>(TYPES.LoggingService);

document.addEventListener('DOMContentLoaded', async () => {
  const data = await storageService.getFromChromeStorage<TodosItems>('notRelistItems');
  loggingService.log('データを取得しました。');

  if (data && data.itemList.length > 0) {
    renderItems(data);
    data.itemList.map((item) => console.log(`https://jp.mercari.com/item/${item.id}`));
  } else {
    loggingService.log('データが存在しません。');
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
    // 新しいタブで開く
    linkElement.target = '_blank';
    linkElement.textContent = item.name;

    detailsElement.appendChild(linkElement);
    itemElement.appendChild(detailsElement);

    container.appendChild(itemElement);
  });
}
