import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../container/inversify.types';
import { ILoggingService } from './loggingService';

export interface ISelectorService {
  getTextContent(element: Element, selector: string): string;
  getThumbnail(element: Element, selector: string): string;
  getHref(element: Element, selector: string): string;
  getId(href: string): string;
  getItemName(name: string): string;
  getRelistItemName(name: string): string;
  isRelistItem(name: string): boolean;
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
      return './mercari.png';
    }
    const thumbnail = targetElement.querySelector('img')?.getAttribute('src');
    return thumbnail ? thumbnail : './mercari.png';
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
      return match[1].trim().replace(/\s+/g, ' ');
    }

    throw new Error('商品名が取得できませんでした');
  }

  getRelistItemName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }

  isRelistItem(name: string): boolean {
    // false を返すパターンにマッチする正規表現
    const falsePatterns = [
      /取引メッセージがあります。返信をお願いします/,
      /受取りました。.*取引完了してください/,
    ];

    for (const pattern of falsePatterns) {
      if (pattern.test(name)) {
        return false;
      }
    }

    return true;
  }
}
