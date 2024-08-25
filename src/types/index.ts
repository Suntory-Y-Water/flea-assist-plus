export type MessageActionsId = {
  action: 'todosItems' | 'getTodosItems' | 'getListingItems';
};

export type MessageResponse = {
  success: boolean;
};

/**
 * @description やることリストから取得した商品の情報
 */
export type TodosItems = {
  itemList: Item[];
};

/**
 * @description やることリストから取得した商品の個別情報
 */
export type Item = {
  id: string;
  name: string;
  thumbnail: string;
  url: string;
};