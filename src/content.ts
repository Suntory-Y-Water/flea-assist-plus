import { container } from './container/inversify.config';
import { TYPES } from './container/inversify.types';
import { IMessageService } from './service/messageService';

const messageService = container.get<IMessageService>(TYPES.MessageService);
messageService.handleTodosItemMessage();
messageService.handleGetListingItemsMessage();
