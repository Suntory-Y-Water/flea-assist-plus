import { container } from './container/inversify.config';
import { TYPES } from './container/inversify.types';
import { IPopupService } from './service/popupService';

const popupService = container.get<IPopupService>(TYPES.PopupService);
popupService.getItemListButtonClick();
popupService.getListingItemsButtonClick();
