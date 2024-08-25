export class Constants {
  /**
   * @description セレクター定数
   */
  static SELECTOR_CONSTANTS = {
    /**
     * @description 出品した商品のセレクター定数
     */
    LISTINGS_CONSTANTS: {
      /** 商品名 */
      NAME: "div.content__884ec505 > a > div > div > div.content__97a42da1 > span",
      /** 商品URL */
      HREF: "div.content__884ec505 > a",
      /** 商品画像 */
      THUMBNAIL: "a > div > div > div.merItemThumbnail.medium__a6f874a2.thumbnail__97a42da1 > figure > div.imageContainer__f8ddf3a2 > picture",
      /** 再出削ボタン */
      CLONE_AND_DELETE_ITEM: "#clone-and-delete-item",
      /** 再出品ボタン */
      CLONE_ITEM: "#clone-item",
      /** 再出品ボタン */
      DELETE_ITEM: "#item-delete",
      /** 公開停止中 */
      NOT_PUBLIC: "div.content__97a42da1 > span.informationLabel__97a42da1",
      /**
       * @description フリマアシストのボタン要素の前部分
       * @example #currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(1) > div.content__884ec505 > a > div > div >
       *          この部分 → #currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(
       */
      FLEA_ASSIST_BUTTON_PREVIOUS: "#currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(",
      /**
       * @description フリマアシストのボタン要素の後ろ部分
       * @example #currentListing > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(1) > div.content__884ec505 > a > div > div >
       *          この部分 → ) > div.content__884ec505 > a > div > div >
       */
      FLEA_ASSIST_BUTTON_NEXT: ") > div.content__884ec505 > a > div > div >"
    },
    TODOS_CONSTANTS: {
      /** やることリストのベースセレクター */
      ITEM_BASE: "#main > div.merList.border__17a1e07b.separator__17a1e07b",
      ITEM_DETAIL: "#main > div.merList.border__17a1e07b.separator__17a1e07b > div:nth-child(3)",
      /** 商品名 */
      NAME: "div.content__884ec505 > a > div > div > div.content__8ccd0d74 > p",
      /** 商品URL */
      HREF: "div.content__884ec505 > a",
      /** 商品画像 */
      THUMBNAIL: "div.content__884ec505 > a > div > div > div.merItemThumbnail.small__a6f874a2.image__8ccd0d74 > figure > div.imageContainer__f8ddf3a2"
    }
  };
  static COMMON_CONSTANTS = {
    GREATER_THAN: " > "
  };
}
