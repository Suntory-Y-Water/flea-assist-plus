import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../container/inversify.types';
import type { ILoggingService } from './loggingService';
import { Item, TodosItems } from '@/types';
import { Constants } from '@/constants';

export interface ISelectorService {
  getTextContent(element: Element, selector: string): string;
  getThumbnail(element: Element, selector: string): string;
  getHref(element: Element, selector: string): string;
  getId(href: string): string;
  getItemName(name: string): string;
  getRelistItemName(name: string): string;
  /**
   * 再出品対象の商品かを判別する
   * 再出品対象じゃない商品の場合は false を返す
   * 対象外商品: 取引メッセージ、受取メッセージ、まとめ買い商品
   * @param {string} message やることリストのメッセージ
   * @return {*}  {boolean}
   */
  isRelistItem(message: string): boolean;
  getTodosItem(element: Element): Item;
  getListingsItem(element: Element): Item;
  getAllItemsFromListings(): TodosItems;
  getAllItemsFromTodos(): TodosItems;
}

@injectable()
export class SelectorService implements ISelectorService {
  constructor(@inject(TYPES.LoggingService) private loggingService: ILoggingService) {}
  getTextContent(element: Element, selector: string): string {
    const targetElement = element.querySelector(selector);
    if (!targetElement) {
      return '';
    }
    return targetElement.textContent || '';
  }

  getThumbnail(element: Element, selector: string): string {
    const targetElement = element.querySelector(selector);
    if (!targetElement) {
      return './box.png';
    }
    const thumbnail = targetElement.querySelector('img')?.getAttribute('src');
    return thumbnail ? thumbnail : './box.png';
  }

  getHref(element: Element, selector: string): string {
    const targetElement = element.querySelector(selector);
    if (!targetElement) {
      return '';
    }
    return targetElement.getAttribute('href') || '';
  }

  getId(href: string): string {
    // /transaction/m43920609129 から m43920609129 を取得
    return href.split('/').pop() || '';
  }

  getItemName(name: string): string {
    // 商品名を抽出する正規表現
    const regex = /「([^」]+)」/;

    // 正規表現でマッチした内容を取得
    const match = name.match(regex);

    // マッチした場合は商品名を返し、それ以外は null を返す
    if (match) {
      // マッチした商品の名前を返す
      return match[1].trim().replace(/\s+/g, '');
    }

    throw new Error('商品名が取得できませんでした');
  }

  getRelistItemName(name: string): string {
    return name.trim().replace(/\s+/g, '');
  }

  isRelistItem(message: string): boolean {
    // false を返すパターンにマッチする正規表現
    const falsePatterns = [
      /取引メッセージがあります。返信をお願いします/,
      /受取りました。.*取引完了してください/,
      /まとめ商品/,
    ];

    for (const pattern of falsePatterns) {
      if (pattern.test(message)) {
        return false;
      }
    }

    return true;
  }

  getTodosItem(element: Element): Item {
    return {
      id: this.getId(this.getHref(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.HREF)),
      name: this.getItemName(
        this.getTextContent(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME),
      ),
      thumbnail: this.getThumbnail(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.THUMBNAIL),
      url: this.getHref(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.HREF),
    };
  }

  getListingsItem(element: Element): Item {
    return {
      id: this.getId(this.getHref(element, Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.HREF)),
      name: this.getRelistItemName(
        this.getTextContent(element, Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.NAME),
      ),
      thumbnail: this.getThumbnail(
        element,
        Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.THUMBNAIL,
      ),
      url: this.getHref(element, Constants.SELECTOR_CONSTANTS.LISTINGS_CONSTANTS.HREF),
    };
  }

  private collectItemsFromPage(
    baseSelector: string,
    itemSelector: string,
    getItemData: (element: Element) => Item,
    validateItem?: (element: Element) => boolean,
  ): TodosItems {
    this.loggingService.log('商品の取得を開始します。');
    const details: Item[] = [];
    let count = 1;
    let element: Element | null;

    while (
      (element = document.querySelector(
        `${baseSelector} > div:nth-child(${count}) > ${itemSelector}`,
      )) !== null
    ) {
      try {
        if (element) {
          if (validateItem && !validateItem(element)) {
            count++;
            continue;
          }

          const productData = getItemData(element);
          details.push(productData);
          count++;
        } else {
          break;
        }
      } catch (error) {
        this.loggingService.error('商品の取得中にエラーが発生しました');
        this.loggingService.error(`エラー内容 : ${(error as Error).message}`);
        break;
      }
    }

    this.loggingService.log('商品の取得が完了しました。');
    return { itemList: details };
  }

  getAllItemsFromListings(): TodosItems {
    return this.collectItemsFromPage(
      '#currentListing > div',
      'div.content__884ec505',
      (element) => this.getListingsItem(element),
      undefined,
    );
  }

  getAllItemsFromTodos(): TodosItems {
    return this.collectItemsFromPage(
      '#main > div.merList.border__17a1e07b.separator__17a1e07b',
      'div.content__884ec505',
      (element) => this.getTodosItem(element),
      (element) => {
        const name = this.getTextContent(
          element,
          Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME,
        );
        return this.isRelistItem(name);
      },
    );
  }
}
