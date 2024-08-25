import { TYPES } from '@/container/inversify.types';
import { container } from '@/container/inversify.config';
import { ISelectorService } from '@/service/selectorService';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Constants } from '@/constants';

describe('SelectorServiceのテスト', () => {
  let selectorService: ISelectorService;

  beforeEach(() => {
    selectorService = container.get<ISelectorService>(TYPES.SelectorService);
    const todosPage = testLoadHtml('todos.html');
    document.body.innerHTML = todosPage;
  });

  function testLoadHtml(fileName: string) {
    return readFileSync(resolve('./src/tests/html', fileName), 'utf8');
  }

  function testLoadElement(count: number) {
    const selector = `#main > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(${count}) > div.content__884ec505`;
    const element = document.querySelector(selector);
    // 本来はnullチェックを行うが、テストのため省略
    return element!;
  }

  test('getTextContent tests テキストを取得できる', () => {
    // arrange
    const element = testLoadElement(2);

    // act
    const result = selectorService.getTextContent(
      element,
      Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME,
    );

    // assert
    expect(typeof result).toBe('string');
  });

  test('getItemName tests 商品名を取得できる', () => {
    // arrange
    const element = testLoadElement(2);

    // act
    const result = selectorService.getItemName(
      selectorService.getTextContent(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME),
    );

    // assert
    expect(result).toBe(`魔弾マッド・ゲンド・チェスターマッドゲンドチェスター2枚`);
  });

  test('getItemName tests 商品名を取得できずエラーをスローする', () => {
    // arrange
    // 「」内の商品名が取得できないようにする
    const element = testLoadElement(3);

    // act and assert
    // act and assert
    expect(() => {
      selectorService.getItemName(
        selectorService.getTextContent(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME),
      );
    }).toThrow('商品名が取得できませんでした');
  });

  test('isRelistItem tests 再出品の対象か判別できる', () => {
    // arrange
    const notRelistElement = testLoadElement(1);
    const relistElement = testLoadElement(2);

    // act
    const notRelistResult = selectorService.isRelistItem(
      selectorService.getTextContent(
        notRelistElement,
        Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME,
      ),
    );
    const relistResult = selectorService.isRelistItem(
      selectorService.getTextContent(
        relistElement,
        Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.NAME,
      ),
    );

    // assert
    expect(notRelistResult).toBe(false);
    expect(relistResult).toBe(true);
  });

  test('getHref tests 商品のhref属性を取得できる', () => {
    // arrange
    const element = testLoadElement(2);

    // act
    const result = selectorService.getHref(
      element,
      Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.HREF,
    );
    // assert
    expect(result).toBe(`/transaction/m11963317881`);
  });

  test('getId tests 商品のhref属性から、id部分のみを取得できる', () => {
    // arrange
    const element = testLoadElement(2);

    // act
    const result = selectorService.getId(
      selectorService.getHref(element, Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.HREF),
    );
    // assert
    expect(result).toBe(`m11963317881`);
  });

  test('getThumbnail tests 商品のサムネイル画像を取得できる', () => {
    // arrange
    const element = testLoadElement(2);
    const defaultElement = testLoadElement(3);

    // act
    const result = selectorService.getThumbnail(
      element,
      Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.THUMBNAIL,
    );

    const defaultResult = selectorService.getThumbnail(
      defaultElement,
      Constants.SELECTOR_CONSTANTS.TODOS_CONSTANTS.THUMBNAIL,
    );

    // assert
    expect(result).toBe(
      'https://static.mercdn.net/c!/w=240/thumb/photos/m11963317881_1.jpg?1724333490',
    );

    expect(defaultResult).toBe('./box.png');
  });
});
