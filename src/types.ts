export interface ProductData {
  name: string | null;
  imageUrl: string | null;
  cloneAndDeleteItemSelector: string | null;
  notPublic: boolean;
}

export interface MessageActionsId {
  action: 'fetchSelectors' | 'cloneAndDeleteItem' | 'startListings';
}
export interface MessageActionsIdWithSelectors extends MessageActionsId {
  selectors: string[];
}

export interface MessageActionsIdWithSingleSelector extends MessageActionsId {
  selector: string;
}

export interface MessageData {
  data: ProductData[];
}
