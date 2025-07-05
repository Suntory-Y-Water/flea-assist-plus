import { Item, TodosItems } from '@/types';
import {} from './loggingService';

function getTextContent(element: Element, selector: string): string {
  const targetElement = element.querySelector(selector);
  if (!targetElement) {
    return '';
  }
  return targetElement.textContent || '';
}

function getThumbnail(element: Element, selector: string): string {
  const targetElement = element.querySelector(selector);
  if (!targetElement) {
    return './box.png';
  }
  const thumbnail = targetElement.getAttribute('src');
  return thumbnail ? thumbnail : './box.png';
}

function getItemName(name: string): string {
  const removedBrackets = name
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/「|」/g, '');

  const regex = /さんが(.+?)(?:を購入しました。|の支払いを完了)/;
  const match = removedBrackets.match(regex);

  if (!match) {
    throw new Error(
      `商品名が取得できませんでした 商品名称: ${removedBrackets}`,
    );
  }

  return match[1].trim().replace(/\s+/g, '');
}

/**
 * 再出品していない商品を特定する
 * 取引メッセージや発送完了メッセージなどは除外
 */
function isRelistItem(message: string): boolean {
  const falsePatterns = [
    /取引メッセージがあります。返信をお願いします/,
    /受取りました。.*取引完了してください/,
    /まとめ商品/,
    /発送されました/,
  ];

  for (const pattern of falsePatterns) {
    if (pattern.test(message)) {
      return false;
    }
  }

  return true;
}

/**
 * 出品している商品のタイトルから不要な文字列を削除
 * やることリストの商品名と突合させるときに使用
 */
function getRelistItemName(name: string): string {
  return name.trim().replace(/\s+/g, '').replace(/「|」/g, '');
}

export function getAllItemsFromListings(): TodosItems {
  const itemList: Item[] = [];
  const itemElements = document.querySelectorAll(
    '#my-page-main-content > div > div > div > div > ul > li > a',
  );

  for (let i = 0; i < itemElements.length; i++) {
    const itemElement = itemElements[i];
    const href = itemElement.getAttribute('href') || '';
    const id = href.split('/').pop() || '';

    const relistItemName = getTextContent(
      itemElement,
      'p[data-testid="item-label"]',
    );
    const name = getRelistItemName(relistItemName);
    const thumbnail = getThumbnail(itemElement, 'picture img');

    itemList.push({
      id,
      name,
      thumbnail,
    });
  }
  return { itemList };
}

export function getAllItemsFromTodos(): TodosItems {
  const itemList: Item[] = [];
  const itemElements = document.querySelectorAll('[data-testid="todo-list"] a');

  for (let i = 0; i < itemElements.length; i++) {
    const itemElement = itemElements[i];
    const href = itemElement.getAttribute('href') || '';
    const id = href.split('/').pop() || '';

    const itemMessage = getTextContent(itemElement, 'p');
    // 特定の単語があったら除外
    if (!isRelistItem(itemMessage)) continue;
    const name = getItemName(itemMessage);

    const thumbnail = getThumbnail(itemElement, 'picture img');

    itemList.push({
      id,
      name,
      thumbnail,
    });
  }
  return { itemList };
}
