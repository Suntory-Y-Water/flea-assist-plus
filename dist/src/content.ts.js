import { container } from "/src/container/inversify.config.ts.js";
import { TYPES } from "/src/container/inversify.types.ts.js";
const messageService = container.get(TYPES.MessageService);
messageService.handleTodosItemMessage();
messageService.handleGetListingItemsMessage();
